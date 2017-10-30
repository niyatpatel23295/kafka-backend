var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/demo3";

function handle_login_request(msg, callback){
        try {
            mongo.connect(mongoURL, function(){

                var coll = mongo.collection('creds');

                coll.findOne({username: msg.username, password: msg.password}, function(err, user){
                    if(err){
                        console.log(err);
                    }
                    if (user) {
                        user.password = undefined;
                        console.log("user",user)
                        callback(null, user);

                    } else {
                        console.log('user not found in backend kafka')
                        callback(null, false);
                    }
                });
            });
        }
        catch (e){
            callback(e,{});
        }
}

exports.handle_login_request = handle_login_request;