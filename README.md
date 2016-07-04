Automatically rebuild and preview a book while developing plugins for tubaina

#Install
```
npm install -g caelum/tubaina2-plugin-test
```
#Running
```
tubaina2-plugin-test <plugin path> [...<plugin path>] --book <path to book> [--type <html|pdf|epub|mobi>] 
```

#What happens

We will listen to changes in the plugins. When things change in any plugin, we will reinstall it and rebuild the book.
If you are working with a html build, we will open and update the browser automatically with [browser-sync](https://www.browsersync.io/).

#Instantaneous preview of changes in html builds 

For much faster preview with html builds we will search for a `tubaina-plugin-manifest.{js|json}` inside your plugin root folder.

Here is an example of a valid manifest: 
```javascript
let pluginPath = 'src'
{
    scripts: `${pluginPath}/**/*.js`
    ,templates: {
        pdf: `${pluginPath}/pdf/templates/**/*.html`
        ,mobi: `${pluginPath}/ebook/templates/**/*.html`
        ,epub: `${pluginPath}/ebook/templates/**/*.html`
        ,html: `${pluginPath}/book/templates/**/*.html`
    }
    ,staticAssets: {
        pdf: `${pluginPath}/pdf/**/*.{css|js|svg|jpg|png}`
        ,mobi: `${pluginPath}/ebook/**/*.{css|js|svg|jpg|png}`
        ,epub: `${pluginPath}/ebook/**/*.{css|js|svg|jpg|png}`
        ,html: `${pluginPath}/book/**/*.{css|js|svg|jpg|png}`
    }
}
```

Everything will work if there is no manifest. But you will regret it;
