var connection =  new require('./kafka/Connection');
var login = require('./services/login');


var consumer_login = connection.getConsumer('login_topic');
var producer = connection.getProducer();


consumer_login.on('message', function (message) {
    console.log('backend server js consumer_login: on ', JSON.stringify(message));
    var data = JSON.parse(message.value);
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
            console.log(payloads)
            producer.send(payloads, function(err, data){
                
            });
            return;
        }
    });
});