"use strict"
const Promise = require('bluebird');
module.exports = function({command, cwd = process.cwd(), live = true}){
    return new Promise((resolve, reject)=>{
        let spawn = require('child_process').spawn
        let splitted_command = command.split(" ")
        let args = splitted_command.filter((element, index) => index != 0)
        let exec = spawn(splitted_command[0], args, {cwd: cwd})
        
        console.log(`[shell] ${command}`)
        
        if (live){
            exec.stdout.on('data', function (data) {
                process.stdout.write(""+data)
            })

            exec.stderr.on('data', function (data) {
                process.stderr.write(""+data)
            })
        }

        exec.on('exit', function (code) {
            code == 0 ? resolve() : reject(code)
        })
        
        exec.on('error', function (error) {
            reject(error)
        })
         
    })
}