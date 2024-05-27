const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    TrafficLightScore1 : {type : String,required : true},
    TrafficLightScore2 : {type : String,required : true},
    TrafficLightScore3 : {type : String,required : true},
    otpcode : {type : String}
});


const Contact = mongoose.model('Contact',contactSchema);

module.exports = Contact;