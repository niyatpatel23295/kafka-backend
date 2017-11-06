var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var fs = require('fs-extra');
var fs_native = require('fs');
var mongo = require("./mongo");

function handle_upload_request(msg, callback){
    try {
		var path = msg.path.startsWith('/') ? msg.path.endsWith('/') ? msg.path : msg.path + '/'	: 	msg.path.endsWith('/') ? '/' + msg.path : '/' + msg.path + '/';

		fs.mkdirsSync('./files/' + msg.username +  path );
		var file_buffer = Buffer.from(msg.buffer);
		fs_native.writeFile('./files/' + msg.username + path + msg.originalname, file_buffer,  function(err, response){
			if(err) {
				callback(err, null);
			}
			else callback(null, {"message" : "success"});
		});
    }
    catch (e){
    	console.log(e);
        callback(e,{});
    }
}

exports.handle_upload_request = handle_upload_request;