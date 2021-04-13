var express = require('express'); // load express 
var router = express.Router(); 
var mongoose = require('mongoose'); // load mongoose
var bodyParser = require('body-parser'); // load body-parser
var methodOverride = require('method-override'); // load method-override

var objectID = require('mongoose').Types.ObjectId;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));


router.route('/')
.get(function(req, res, next) { // GET LIST OF CLIENTS
    mongoose.model('Client').find({}, function (err, clients) {
        if (err) {
            return console.error(err);
        } else {
            res.format({
                html: function(){
                    res.render('clients/index', {
                        title: 'All clients',
                        "clients" : clients
                    });
                },
                json: function(){
                    res.json(infophotos);
                }
            });
        }
    });
})
.post(function(req, res) {
    var clienteName = req.body.eName;
    var clientkName = req.body.kName;
    var clientNumber = req.body.cNumber;
    var clientVNFManufacturer = req.body.vnfManufacturer;
    var clientVNFmgmtIP = req.body.mgmtIP;
    var clientVNFIP = req.body.vnfIP;
    var clientServiceName = req.body.sName;
    if (req.body.isInService) {
        var isInService = true;
    } else {
        var isInService = false;
    }

    mongoose.model('Client').create({
        clienteName : clienteName,
        clientkName : clientkName,
        clientNumber : clientNumber,
        clientVNFManufacturer : clientVNFManufacturer,
        clientVNFmgmtIP : clientVNFmgmtIP,
        clientVNFIP : clientVNFIP,
        clientServiceName : clientServiceName,
        isInService : isInService
    }, function (err, client) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            console.log('POST creating new client: ' + client);
            res.format({
                html: function(){
                    res.location("nfv");
                    res.redirect("/nfv");
                },
                json: function(){
                    res.json(client);
                }
            });
        }
    });
});

router.param('id', function(req, res, next, id) {
    console.log('validating ' + id + ' exists');
    
    mongoose.model('Client').findById(id, function (err, client) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
        } else {
            console.log(client);
            req.id = id;
            next();
        }
    });
});

router.param('branchid', (req, res,next, branchid) => {
    console.log('validating ' + branchid + ' exists');
    mongoose.model('Branch').findById(branchid, (err, branch) => {
        if (err) {
            console.log(branchid + 'was not found');
            res.status(404);
            res.format({
                html: () => {
                    next(err);
                },
                json: () => {
                    res.json({message : err.status + ' ' + err});
                }
            });
        } else {
            console.log(branch);
            req.branchid = branchid;
            next();
        }
    });    
});

// ADD NEW CLIENT // MAY NOT BE USED but FOR REFERENCE
// router.get('/new', function(req, res) {
    //     res.render('clients/new', { title: 'Add New client' });
    // });
    
router.route('/:id')
.get(function(req, res) { // GET LIST OF BRANCHES OF THE CLIENT
    mongoose.model('Client').findById(req.id, function (err, client) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            mongoose.model('Branch').find({"clientID": new objectID(req.id)}).sort({"branchVPRN": 1}).exec((err, branches) => {
                if (err) {
                    console.error(err);                    
                } else {
                    // console.log('/:id - branches' + branches);
                    res.format({
                        html: () => {
                            res.render('clients/show', {
                                "client" : client,
                                "branches" : branches
                            })
                        },
                        json: () => {
                            res.json(client, branches)
                        }
                    });
                }
            });
        }
    });
}).post((req, res) => { // ADD A NEW BRANCH TO THE CLIENT
    var clientID = req.id;
    var brancheName = req.body.eName;
    var branchkName = req.body.kName;
    var branchrNumber = req.body.rNumber;
    var branchlNumber = req.body.lNumber;
    var branchIntIPRange = req.body.IPRange;
    var branchIntGateway = req.body.gateway
    var branchPublicIP = req.body.publicIP;
    var branchVPRN = req.body.VPRN;
    if (req.body.isTarget) {
        var isTarget = true;
    } else {
        var isTarget = false;
    }
    
    mongoose.model('Branch').create({
        clientID: clientID,
        brancheName : brancheName,
        branchkName : branchkName,
        branchrNumber : branchrNumber,
        branchlNumber : branchlNumber,
        branchIntIPRange : branchIntIPRange,
        branchIntGateway : branchIntGateway,
        branchPublicIP : branchPublicIP,
        branchVPRN : branchVPRN,
        isTarget : isTarget
    }, (err, branch) => {
        if (err) {
            res.send("There was a problem adding the information to the database.!");
        } else {
            console.log('POST creating new branch: ' + branch);
            res.format({
                html: () =>{                   
                    res.redirect(`/nfv/${branch.clientID}`);
                },
                json:() => {
                    res.json(branch);
                }
            });
        }
    });
});

router.route('/branches').get((req, res, next) => {
    mongoose.model('Branch').find({}, (err, branches) => {
        if (err) {
            return console.error(err)
        } else {
            res.format({
                html: () => {
                    res.render('clients/branches', {
                        title: 'all branches',
                        "branches" : branches
                    })
                },
                json: () => {
                    res.json(infophotos);
                }
            })
        }
    })
})


router.get('/:id/new', (req, res) => { // GO TO ADD_BRANCH_PAGE
    console.log(req.id);
    res.render('clients/newbranch', { 
        client_id:req.id,
        title: 'Add New branch'
    });
})

router.route('/:id/edit').get(function(req, res) {
    mongoose.model('Client').findById(req.id, function (err, client) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            console.log('GET Retrieving ID: ' + client._id);       
            res.format({
                html: function(){
                    res.render('clients/edit', {
                        title: 'Clients' + client._id,
                        "client" : client
                    });
                },
                json: function(){
                    res.json(client);
                }
            });
        }
    });
}).post(function(req, res) {
    console.log('edit called');
    
    var clienteName = req.body.eName;
    var clientkName = req.body.kName;
    var clientNumber = req.body.cNumber;
    var clientVNFManufacturer = req.body.vnfManufacturer;
    var clientVNFmgmtIP = req.body.mgmtIP;
    var clientVNFIP = req.body.vnfIP;
    var clientServiceName = req.body.sName;
    if (req.body.isInService) {
        var isInService = true;
    } else {
        var isInService = false;
    }

    mongoose.model('Client').findById(req.id, function (err, client) {
        client.update({
            clienteName : clienteName,
            clientkName : clientkName,
            clientNumber : clientNumber,
            clientVNFManufacturer : clientVNFManufacturer,
            clientVNFmgmtIP : clientVNFmgmtIP,
            clientVNFIP : clientVNFIP,
            clientServiceName : clientServiceName,
            isInService : isInService
        }, function (err, clientID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                res.format({
                    html: function(){
                        res.redirect(`/nfv/${client._id}`);
                    },
                    json: function(){
                        res.json(client);
                    }
                });
            }
        });
    });
});



/* -----------------------------------------------------
--------------------- About Branch ---------------------
----------------------------------------------------- */

router.route('/:id/:branchid/edit').get(function(req, res) {
    mongoose.model('Client').findById(req.id, function (err, client) {
        if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            mongoose.model('Branch').findById(req.branchid, (err, branch) => {
                if (err) {
                    console.error(err);
                } else {
                    res.format({
                        html: () => {
                            res.render('clients/editbranch', {
                                "client" : client,
                                "branch" : branch
                            });
                        },
                        json: () => {
                            res.json(client, branch);
                        }
                    });
                }
            });
        }
    });
}).post((req, res) => {
    // console.log('branch edit called');   
    var brancheName = req.body.beName;          // 영문명
    var branchkName = req.body.bkName;          // 한글명
    var branchrNumber = req.body.brNumber;      // 가입번호(== FQDN)
    var branchLineNumber = req.body.blNumber;   // 회선번호
    var branchIntIPRange = req.body.brIIPR;     // 내부IP
    var branchIntGateway = req.body.brGateway   // 내부IP G/W
    var branchPublicIP = req.body.bpIP;         // 공인IP
    var branchVPRN = req.body.bVPRN;            // VPRN
    // console.log("\n\n\n\nisTarget??  " + req.body.isTarget + "\n\n\n\n");
    if (req.body.isTarget) {
        var isTarget = true;
    } else {
        var isTarget = false;
    }
    
    mongoose.model('Branch').findById(req.branchid, (err, branch) => {
        branch.update({
            brancheName : brancheName,
            branchkName : branchkName,
            branchrNumber : branchrNumber,
            branchLineNumber : branchLineNumber,
            branchIntIPRange : branchIntIPRange,
            branchIntGateway : branchIntGateway,
            branchPublicIP : branchPublicIP,
            branchVPRN : branchVPRN,
            isTarget : isTarget
        }, (err, branchID) => {
            if (err) {
                res.send("")
            } else {
                res.format({
                    html: () => {
                        res.redirect(`/nfv/${branch.clientID}`);
                    },
                    json:() => {
                        res.json(client)
                    }
                });
            }
        });
    });
});

router.route('/:id/:branchid/delete').post((req, res) => {
    mongoose.model('Branch').findById(req.branchid, (err, branch) => {
        if (err) {
            console.error(err);
        } else {
            branch.remove((err, branch) => {
                if (err) {
                    return console.error(err);
                } else {
                    console.log('DELETE removing ID: ' + branch._id);
                    res.format({
                        html: function(){
                            res.redirect("/nfv/" + branch.clientID);
                        },
                        json: function(){
                            res.json({message : 'deleted',
                            item : branch
                            });
                        }
                    });
                }
                
            })
        }
    })
})

module.exports = router;
