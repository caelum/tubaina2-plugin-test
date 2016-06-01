"use strict"
const path = require('path')

module.exports = function(pluginPath){
    let plugin = require(path.join(pluginPath, "tubaina-plugin-manifest"))
    plugin.path = pluginPath
    return plugin
}