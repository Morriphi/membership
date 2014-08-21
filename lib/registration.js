var User = require('../models/user');
var Application = require('../models/application');
var assert = require('assert');
var bcrypt = require('bcrypt-nodejs');
var Log = require('../models/log');
var util = require('util');
var Emitter = require('events').EventEmitter;

var Registration = function (db) {
    Emitter.call(this);

    var self = this;

    var onCompleted;
    var application;

    var RegResult = function () {
        return {
            success: false,
            message: null,
            user: null
        };
    };

    var checkIfUserExists = function (app) {
        db.users.exists({email: app.email}, function (err, exists) {
            assert.ok(err === null, err);
            if (exists) {
                app.message = 'Email already exists';
                self.emit('user-exists', app);
            } else {
                self.emit('user-does-not-exist', app);
            }
        });
    };

    var saveUser = function (app) {
        var user = new User(app);
        user.hashedPassword = bcrypt.hashSync(app.password);
        user.status = 'approved';
        user.signInCount = 1;

        db.users.save(user, function (err, savedUser) {
            assert.ok(err === null, err);
            app.user = savedUser;
            self.emit('user-saved', app);
        });
    };

    var addLogEntry = function (app) {
        db.logs.save(new Log({
            subject: 'Registration',
            entry: 'Successfully Registered',
            userId: app.user.id
        }), function (err, savedLog) {
            assert.ok(err === null, err);
            app.log = savedLog;
            self.emit('log-saved', app);
        });
    };

    var registrationOk = function(app) {
        var regResult = new RegResult();
        regResult.success = true;
        regResult.message = 'Welcome!';
        regResult.user = app.user;
        regResult.log = app.log;

        onCompleted(null, regResult);
    };

    var registrationFailed = function(app) {
        var regResult = new RegResult();
        regResult.success = false;
        regResult.message = app.message;

        onCompleted(null, regResult);
    };

    self.on('user-does-not-exist', saveUser);
    self.on('user-saved', addLogEntry);
    self.on('log-saved', registrationOk);
    self.on('user-exists', registrationFailed);

    self.applyForMembership = function (args, next) {
        onCompleted = next;
        application = new Application(args);
        application.validate(checkIfUserExists, registrationFailed);
    };
};

util.inherits(Registration, Emitter);
module.exports = Registration;
