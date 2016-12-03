/**
 * Created by Kaakashi on 24/05/15.
 */
var config = require('./config');
var cradle = require('cradle');


//Db connection
var db = new (cradle.Connection)(config.database.address,
    {
        port: config.database.port,
        auth: {
            username: config.database.username,
            password: config.database.password
        }
    }).database(config.database.name);

module.exports = db;