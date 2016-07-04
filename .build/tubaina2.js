"use strict"
const path = require('path')
const exec = require('./exec')

module.exports = function(tubainaPath = ''){
	return{
		build({apostilaPath, type = 'pdf', plugins = []}){
			return exec(`npm install -g ${plugins.map(p => p.path).join(' ')}`)
					.then(()=>{
						console.log(`[watch][STARTED] ${type} build`)
						return exec(`${path.join(tubainaPath, "tubaina2")} --native --${type} --plugins ${plugins.map(p => p.name).join(',')}`, {cwd: apostilaPath})
					})
					.then(()=>{
						console.log(`[watch][FINISHED] ${type} build`)
						return {
							buildPath: {
								html: path.join(apostilaPath, '.build/_book/')
								,pdf: path.join(apostilaPath, '.build/book.pdf')
							}[type]
						}
					})
					.catch(e => console.error(e))
		}
	}
}
