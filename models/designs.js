/**
 * Created by Kaakashi on 27/05/15.
 */

var db = require('../config/database');

//Create designs
db.save('_design/list', {
    all    : {
        map: function (doc) {
            if (doc.time) {
                emit([doc.time], doc);
            }
        }
    },
    by_time: {
        map: function (doc) {
            if (doc.time) {
                var time = new Date(doc.time).getTime();
                emit(time, doc.time);
            }
        }
    },
    lum    : {
        map: function (doc) {
            if (doc.time) {
                var time = new Date(doc.time).getTime();
                emit(time, {
                    time: doc.time,
                    lum : doc.lum
                });
            }
        }
    },
    hum    : {
        map: function (doc) {
            if (doc.time) {
                var time = new Date(doc.time).getTime();
                emit(time, {
                    time: doc.time,
                    hum : doc.hum
                });
            }
        }
    },
    infos  : {
        map: function (doc) {
            if (doc.time) {
                var key = new Date(doc.time).getTime();
                emit(key, {
                    type  : doc.type,
                    grp   : doc.grp,
                    center: doc.center,
                    server: doc.server
                });
            }
        }
    }
});

//Export designs calls
module.exports = {
    list_all: function (cb) {
        db.view('list/all', cb);
    },
    by_time : function (dates, cb) {
        db.view('list/by_time', {
            startkey: dates.from.getTime(),
            endkey  : dates.to.getTime()
        }, cb);
    },
    lum     : function (when, cb) {
        db.view('list/lum', {
            startkey  : when,
            descending: true,
            limit     : 1
        }, cb);
    },
    hum     : function (when, cb) {
        db.view('list/hum', {
            startkey  : when,
            descending: true,
            limit     : 1
        }, cb);
    },
    infos   : function (cb) {
        db.view('list/infos', {
            startkey  : Date.now(),
            descending: true,
            limit     : 1
        }, cb);
    }
};