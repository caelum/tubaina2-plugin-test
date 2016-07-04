const path = require('path')
const watch = require('glob-watcher')

module.exports = function(plugins){

    return apostila => {
        let {pluginsWithValidManifest, pluginsWithoutManifest} = plugins.reduce((l,p) => {
            p.files && 
            p.files.scripts && 
            p.files.templates && 
            p.files.templates[apostila.type] && 
            p.files.staticAssets && 
            p.files.staticAssets[apostila.type] &&
            l.pluginsWithValidManifest.push(p) || l.pluginsWithoutManifest.push(p)
            return l
        }, {
            pluginsWithValidManifest: []
            ,pluginsWithoutManifest: []
        })
        
        pluginsWithValidManifest.forEach(p => {
            watch([p.files.scripts, p.files.templates[args.type], p.files.staticAssets[args.type]], ()=>{
                return apostila.rebuildUpdating(p).then(()=> console.log(
                    `Open ${apostila.buildPath} to see changes`)
                )
            })
        })
        
        pluginsWithoutManifest.forEach(p => {
            watch([path.join(p.path, "/**/*")], ()=>{
                return apostila.rebuildUpdating(p).then(()=> console.log(
                    `Open ${apostila.buildPath} to see changes`)
                )
            })
        })    
    }
            
}