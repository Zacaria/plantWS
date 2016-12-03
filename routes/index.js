var express = require('express');
var router = express.Router();
var cradle = require('cradle');
var database = require('../models/designs');

/* GET home page. */
router.get('/', function (req, res, next) {

    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key       : 't67reIXFV2SEDh8ZTj2CUxs7V',
        consumer_secret    : 'ZwHP5wxShYksX0XLjwTZieDYAw3KdCGWc0vpRFQQjR66KSdWPy',
        access_token_key   : '3227267366-CImiiJbMh9xtWbQry6BI4QAFXwldXKwGcNqWYwz',
        access_token_secret: 'n2vcRwnkgYT3DkmffPZ2QQ0zGFAtg79RqfzdLeM6OyWY6'
    });

    var params = {screen_name: 'PlantusVertus'};
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            res.json(tweets);
        }
    });
    var tag = " #RoboPot";
    var msg = {
        help: [
            "J'ai soif !",
            "Occupe toi de moi !",
            "Maman, il me faut de l'eau"
        ],
        idle :[
            "Regarde comme il fait beau, dehors faut sortir s'amuser ! #OrelSan",
            "Aujourd'hui je #PhotoSynthèse #OKLM http://bit.ly/1FDhbfc"
        ]
    };
//    var msg = {
//        status: 'En direct du projet A4, pause Twitter :D @eXiaCesiRouen @Half76 @ChtatarZacaria @RolandComa #VieDePlante #nodejs'
//    };
//    client.post('statuses/update', msg, function (error, tweet, response) {
//        if (error) throw error;
//        console.log(tweet);  // Tweet body.
//        console.log(response);  // Raw response object.
//    });

});

router.get('/info', function (req, res, next) {
    database.infos(function (err, data) {
        if (err) return next(err);

        res.json(data);
    })
});

router.get('/hum', function (req, res, next) {
    database.hum(Date.now(), function (err, data) {
        if (err) return next(err);

        res.json(data);
    });
});

router.get('/lum', function (req, res, next) {
    database.lum(Date.now(), function (err, data) {
        if (err) return next(err);

        res.json(data);
    });
});

router.get('/predict', get_point('a', 1), get_point('b', 0), function (req, res, next) {


    var threshold = 20;
    var projection, A, B, coeff, ord_orig;

    A = {
        x: req.a[0].key,
        y: req.a[0].value.hum
    };

    B = {
        x: req.b[0].key,
        y: req.b[0].value.hum
    };

    coeff = (B.y - A.y) / (B.x - A.x);

    ord_orig = A.y - (coeff * A.x);

    dateProj = Math.round(threshold - ord_orig / coeff);

    projection = Math.round(Math.abs(Date.now() - new Date(dateProj))/1000/60/60/24);

    res.json({
        proj : projection,
        date: new Date(dateProj)
    });
});

function get_point(name, time) {
    var from = new Date();
    from.setDate(from.getDate() - time);

    return function (req, res, next) {
        database.hum(from.getTime(), function (err, data) {
            if (name === 'a') {
                req.a = data;
            } else if (name === 'b') {
                req.b = data;
            }
            next();
        });
    }
}

module.exports = router;
