#!/usr/bin/env node
"use strict"
const glob = require('glob')
const Plugin = require('./Plugin')
const HTMLBookPLuginLiveBuild = require('./HTMLBookPluginLiveBuild')
const EbookPluginLiveBuild = require('./EbookPluginLiveBuild')


let args = require('minimist')(process.argv.slice(2), {
   string: ['tubaina','book','type']
	,default: {
		type: 'pdf'
		,tubaina: ''
	}
})

let plugins = args._.map(pluginPath => new Plugin(pluginPath))

let fullBuild = require('./Tubaina2')({
	apostilaPath: args.book
	, type: args.type
	,plugins: plugins
}) 

if(args.type === 'html'){
	fullBuild.then(HTMLBookPLuginLiveBuild(plugins))
} else {
	fullBuild.then(EbookPluginLiveBuild(plugins))
}

fullBuild.catch(e => console.error(`It wasn't possible to build due to: \n ${e}`))
