var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var listdir = require('./services/listdir');
var upload_file = require('./services/uploaddir')
var consumer_login = connection.getConsumer('new_topic_1');
// var consumer_signup = connection.getConsumer('signup_topic');
// var consumer_list_dir = connection.getConsumer('list_dir_topic');

var producer = connection.getProducer();


consumer_login.on('message', function (message) {
    console.log('backend server js consumer_login: on ', JSON.stringify(message));
    var data = JSON.parse(message.value);
    if(message.key == 'login_api'){
        login.handle_login_request(data.data, function(err,res){
            if(err){
                console.log(err);
                producer.send({error: err}, function(err, data){
                   
                });
                return;
            }
            else{
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                
                producer.send(payloads, function(err, data){
                    
                });
                return;
            }
        });
    }
    else if(message.key == 'signup_api'){
        console.log("Some other request");
        console.log('backend server js consumer_signup: on ', JSON.stringify(message));
        var data = JSON.parse(message.value);
        signup.handle_signup_request(data.data, function(err, res){
            if(err){
                console.log('err');
                producer.send({error:err}, function(err, res){});
                return;
            }
            else{
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                console.log(payloads)
                producer.send(payloads, function(err, data){});
                return;
            }

        });
    }
    else if(message.key == 'list_directory_api'){
        listdir.handle_listdir_request(data.data, function(err, res){
            try{
                if(err){
                    
                    return;
                }
                else{
                    var payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    console.log(payloads)
                    producer.send(payloads, function(err, data){});
                    return;
                }
            }
            catch (e){
                
            }

        });
    }
    else if(message.key == 'upload_dir_api'){
        upload_file.handle_upload_request(data.data, function(err, res){
            try{
                if(err){
                    console.log(err);
                    return err;
                }
                else{
                    var payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    
                    producer.send(payloads, function(err, data){});
                    return;
                }
            }
            catch (e){
                console.log(e)
            }

        });
    }
});

/*consumer_signup.on('message', function(message){

})*/