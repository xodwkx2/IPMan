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
.get((req, res, next) => {
    mongoose.model('NAT').find({}).sort({"natIP": 1}).exec((err, nats) => {
        if (err) {
            return console.error(err);
        } else {
            res.format({
                html: () => {
                    // res.send('NAT IPs loaded');
                    res.render('nats/index', {
                        title: 'All Nats',
                        "nats" : nats
                    });






                }
            });
        }
    });
});
module.exports = router;
