var mongo = require("./mongo");

function handle_signup_request(msg, callback){
        try {
            console.log('Mark 1 - before mondo data insert');
            mongo.connect('mongodb://localhost:27017/demo3', function(){
                var collection = mongo.collection('creds')
                collection.insertOne({
                    firstname: msg.firstname,
                    lastname: msg.lastname,
                    email: msg.email,
                    username: msg.username,
                    password: msg.password
                }).then(function(result){
                    
                    callback(null, result.ops[0]);
                }).
                catch(function(e){
                    callback({"error": "User already exists... Try login instead!"}, false);
                });
            });
        }
        catch (e){
            callback(e,{});
        }
}

exports.handle_signup_request = handle_signup_request;