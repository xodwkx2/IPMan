var mongoose = require('mongoose');
var clientSchema = new mongoose.Schema({
    clienteName: String,
    clientkName: String,
    clientNumber: Number,
    clientVNFManufacturer: String,
    clientVNFmgmtIP: String,
    clientVNFIP: String,
    clientServiceName: String,
    isInService: Boolean
})

mongoose.model('Client', clientSchema);
