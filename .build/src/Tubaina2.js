"use strict"
const path = require('path')
const exec = require('./Shell')

module.exports = function build({tubainaPath = '', apostilaPath, type = 'pdf', plugins = []}){
	return exec({
			command: `npm install -g ${plugins.map(p => p.path).join(' ')}`
		})
		.then(() => {
			return exec({
				command: `${path.join(tubainaPath, "tubaina2")} --native --${type} --plugins ${plugins.map(p => p.name).join(',')}`
				,cwd: apostilaPath
			})	
		})
		.then(() => console.log(`[watch][FINISHED] ${type} build`))
		.then(() => ({
			buildPath: {
				html: path.join(apostilaPath, '.build/_book/')
				,pdf: path.join(apostilaPath, '.build/book.pdf')
			}[type]
			,rebuildUpdating: (...pluginsToUpdate) => build({
				tubainaPath
				,apostilaPath
				,type
				,plugins: pluginsToUpdate
			})
		}))
}
