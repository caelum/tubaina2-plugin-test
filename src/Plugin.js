"use strict"
const path = require('path')

module.exports = function(pluginPath){
    let pluginName
    try {
        pluginName = require(path.join(pluginPath, "package")).name
        pluginName = pluginName.match(/^gitbook-plugin-(.+)/)[1]
    } catch(e){
        throw new ReferenceError(`No plugin found at ${pluginPath}`)
    }
    
    let pluginManifest
    try {
        pluginManifest = require(path.join(pluginPath, "tubaina-plugin-manifest"))
    } catch(e){
        console.log(`[WARNING] No tubaina-plugin-manifest found for ${pluginName}.`)
    }
    
    let absolutePluginGlob = glob => path.join(pluginPath, glob || "/**/*")
    
    for (var key in pluginManifest) {
        if (pluginManifest.hasOwnProperty(key)) {
            pluginManifest[key] = {
                scripts: (manifest) => manifest.scripts && absolutePluginGlob(manifest.scripts)
                ,templates: (manifest) => manifest.templates && {
                    pdf: absolutePluginGlob(manifest.templates.pdf)
                    ,mobi: absolutePluginGlob(manifest.templates.mobi)
                    ,epub: absolutePluginGlob(manifest.templates.epub)
                    ,html: absolutePluginGlob(manifest.templates.html)
                }
                ,staticAssets: (manifest) => manifest.staticAssets && {
                    pdf: absolutePluginGlob(manifest.staticAssets.pdf)
                    ,mobi: absolutePluginGlob(manifest.staticAssets.mobi)
                    ,epub: absolutePluginGlob(manifest.staticAssets.epub)
                    ,html: absolutePluginGlob(manifest.staticAssets.html)
                }
            }[key](pluginManifest)
        }
    }
    
    let plugin = {}
    plugin.name = pluginName
    plugin.path = pluginPath
    plugin.files = pluginManifest
    
    return plugin
}