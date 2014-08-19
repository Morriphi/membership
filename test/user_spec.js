var util = require('util');
var should = require('should');
var User = require('../models/user');

describe('User', function () {
    describe('defaults', function () {
        var user = {};

        before(function () {
            user = new User({email: 'test@email.com'});
        });

        it('requires email', function () {
            should(function () {
                new User({});
            }).throw('Email is required');
        });

        isEqual('email', 'test@email.com');
        isEqual('status', 'pending');
        isEqual('signInCount', 0);

        isDefined('authenticationToken');
        isDefined('createdAt');
        isDefined('lastLoginAt')
        isDefined('currentLoginAt');

        function isDefined(prop) {
            it(util.format('has %s', prop), function () {
                user[prop].should.be.defined;
            });
        };

        function isEqual(prop, value) {
            it(util.format('has a %s %s', value, prop), function () {
                user[prop].should.equal(value);
            });
        };
    });
});
