var mongo = require("./mongo");
var fs = require('fs-extra');
var fs_native = require('fs');

function handle_listdir_request(msg, callback){
        try {

            var filesList = fs.readdirSync('./files/' + msg.username );
            
            var files = [];
            var folders = [];
            var result = {};

            filesList.forEach(function(item, index){
                if(fs_native.statSync('./files/' + msg.username + '/' + item).isFile()){
                    files.push(item);
                }
                else{
                    folders.push(item);
                }
            });
            result.files = files;
            result.folders = folders;
            callback(null, result);
        }
        catch (e){
            callback(e,{});
        }
}

exports.handle_listdir_request = handle_listdir_request;