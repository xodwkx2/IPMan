var mongoose = require('mongoose');
var objectID = mongoose.Types.ObjectId;
var branchSchema = new mongoose.Schema({    
    clientID: objectID,
    brancheName: String,
    branchkName: String,
    branchrNumber: Number,
    branchLineNumber: Number,
    branchIntIPRange: String,
    branchIntGateway: String,
    branchPublicIP: String,
    branchVPRN: Number,
    isTarget: Boolean
})

mongoose.model('Branch', branchSchema);
