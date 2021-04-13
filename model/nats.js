var mongoose = require('mongoose');
var natSchema = new mongoose.Schema({
    nateName: String,
    natkName: String,
    natIP: String,      // 나트 IP
    natTO: String
})

mongoose.model('NAT', natSchema);
