#!/usr/bin/env node
"use strict"
const promisify = require('bluebird').promisify
const watch = require('glob-watcher')
const bs = require('browser-sync').create()
const Plugin = require('./Plugin')

let args = require('minimist')(process.argv.slice(2), {
   string: ['tubaina', 'apostila','type', 'plugins']
	,default: {
		type: 'pdf'
		,tubaina: ''
	}
})

let plugins = []
try {
	plugins = args.plugins.split(",").map(path => new Plugin(path))
} catch(e) {
	console.error(e)
	console.error("Wrong or missing plugin paths to argument --plugins")
	process.abort()
}

let tubaina2 = require('./tubaina2')(args.tubaina)
let updateAndBuild = (plugins) => tubaina2.build({
	apostilaPath: args.apostila
	,type: args.type
	,plugins: plugins
})

let fullBuild = updateAndBuild(plugins)
if(args.type === 'html'){
	fullBuild.then(apostila => {
		return promisify(bs.init)({
			server: [apostila.buildPath, ...plugins.map(p => p.staticAssets.path)]
			,rewriteRules: plugins.map(plugin => {
				return {
					match: new RegExp(`gitbook\/plugins\/gitbook-plugin-${plugin.name}\/(.*\.css)`, "g")
					,replace: "$1"
				}
			})
		}).then(()=>{
			plugins.forEach(plugin => {
				watch([plugin.scripts.glob, plugin.templates.glob], ()=>{
					bs.notify(`Building changes`, 20000)
					return updateAndBuild([plugin]).then(bs.reload)
				})
				watch(plugin.staticAssets.glob).on('change', path => bs.reload(path))
			})
		})
	})
	.then(()=>console.log("Browser will reload when necessary"))
} else if(args.type === 'pdf') {
	fullBuild.then(apostila => {
		plugins.forEach(plugin => {
			watch([plugin.scripts.glob, plugin.templates.glob, plugin.staticAssets.glob], ()=>{
				return updateAndBuild([plugin]).then(()=>console.log(`Open ${apostila.buildPath} file to see changes`))
			})
		})
	})
}	

fullBuild.catch(e => console.error(`It wasn't possible to build due to: \n ${e}`))
