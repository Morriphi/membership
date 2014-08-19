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

    var RegResult = function () {
        return {
            success: false,
            message: null,
            user: null
        };
    };

    var checkIfUserExists = function (app, next) {
        db.users.exists({email: app.email}, next);
    };

    var saveUser = function (user, next) {
        db.users.save(user, next);
    };

    var addLogEntry = function (user, next) {
        db.logs.save(new Log({
            subject: 'Registration',
            entry: 'Successfully Registered',
            userId: user.id
        }), next);
    }

    self.applyForMembership = function (args, next) {
        var regResult = new RegResult();

        var app = new Application(args);

        app.validateInputs();

        if (app.isValid()) {

            checkIfUserExists(app, function (err, exists) {
                assert.ok(err === null, err);
                if (!exists) {
                    var user = new User(app);
                    user.hashedPassword = bcrypt.hashSync(app.password);
                    saveUser(user, function (err, savedUser) {
                        assert.ok(err === null, err);
                        savedUser.status = 'approved'
                        savedUser.signInCount = 1;
                        regResult.user = savedUser;
                        addLogEntry(savedUser, function (err, result) {
                            assert.ok(err === null, err);
                            regResult.log = result;
                            regResult.success = true;
                            regResult.message = 'Welcome!';
                            next(null, regResult);
                        });
                    });
                } else {
                    regResult.success = false;
                    regResult.message = 'Email already exists';
                    next(null, regResult);
                }
            });
        } else {
            regResult.message = app.message;
            next(null, regResult);
        }


    };
};

util.inherits(Registration, Emitter);
module.exports = Registration;
