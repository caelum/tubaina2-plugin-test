const path = require('path')
const promisify = require('bluebird').promisify
const bs = require('browser-sync').create()
const initServer = promisify(bs.init)
const watch = require('glob-watcher')

module.exports = function(plugins=[]){
    pluginsWithManifest = plugins.filter(p => p.files && p.files.staticAssets && p.files.staticAssets.html)
    return apostila => initServer({
        server: [apostila.buildPath, ...pluginsWithManifest.map(p => p.files.staticAssets.html.replace(/\*\*\/\*.*/, ""))]
        ,rewriteRules: pluginsWithManifest.map(p => {
            return {
                match: new RegExp(`gitbook\/plugins\/gitbook-plugin-${p.name}\/(.+\..+)`, "g")
                ,replace: "../$1"
            }
        })
    }).then(() => {
        plugins.forEach(p => {
            if(p.files && p.files.scripts && p.files.templates && p.files.templates.html && p.files.staticAssets && p.files.staticAssets.html){
                watch([p.files.scripts, p.files.templates.html], ()=>{
                    bs.notify(`Building changes`, 20000)
                    return apostila.rebuildUpdating(p).then(bs.reload)
                })
                watch(p.files.staticAssets.html).on('change', bs.reload)
            } else {
                console.warn("[WARNING] Unknows plugin files. HTML Live Reload will be slower")
                watch([path.join(p.path, "/**/*")], ()=>{
                    bs.notify(`Building changes`, 20000)
                    return apostila.rebuildUpdating(p).then(bs.reload)
                })
            }
        })
    })
    .then(() => console.log("Browser will reload when necessary"))    
}
 