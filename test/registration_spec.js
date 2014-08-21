var Registration = require('../lib/registration');
var db = require('secondthought');
var should = require('should');

describe('Registration', function () {
    var reg = {};

    before(function (done) {
        db.connect({db: 'membership'}, function (err, db) {
            reg = new Registration(db);
            done();
        });
    });

    // happy path
    describe('a valid application', function () {
        var regResult = {};

        before(function (done) {
            db.users.destroyAll(function () {
                db.logs.destroyAll(function () {
                    reg.applyForMembership({
                            email: 'test@email.com',
                            password: 'pass',
                            confirm: 'pass'},
                        function (err, result) {
                            regResult = result;
                            done();
                        });
                });
            });
        });

        it('is successful', function () {
            regResult.success.should.equal(true);
        });

        it('created a user', function () {
            regResult.user.should.be.defined;
        });

        it('creates a log entry', function () {
            regResult.log.should.be.defined;
        });

        it('sets the users status to approved', function () {
            regResult.user.status.should.equal('approved');
        });

        it('offers a welcome message', function () {
            regResult.message.should.equal('Welcome!');
        });

        it('increments users signInCount', function () {
            regResult.user.signInCount.should.equal(1);
        })
    });

    describe('an empty or null email', function () {
        var regResult = {};

        before(function (done) {
            reg.applyForMembership({
                email: null,
                password: 'pass',
                confirm: 'pass'}, function(err, result){
                regResult = result;
                done();
            });
        });

        it('is not successful', function () {
            regResult.success.should.equal(false);
        });

        it('tells user that email is required', function(){
            regResult.message.should.equal('Email is required');
        });
    });

    describe('an empty or null password', function () {

        var regResult = {};

        before(function (done) {
            reg.applyForMembership({
                email: 'test@email.com',
                password: null,
                confirm: 'pass'}, function(err, result){
                regResult = result;
                done();
            });
        });

        it('is not successful', function(){
            regResult.success.should.equal(false);
        });

        it('tell user that password is required', function(){
            regResult.message.should.equal('Password is required');
        });
    });

    describe('password and confirm mismatch', function () {

        var regResult = {};

        before(function (done) {
            reg.applyForMembership({
                email: 'test@email.com',
                password: 'pass1',
                confirm: 'pass2'}, function(err, result){
                regResult = result;
                done();
            });
        });

        it('is not successful', function(){
            regResult.success.should.equal(false);
        });

        it('tells the user that password don\'t match', function(){
            regResult.message.should.equal('Passwords don\'t match');
        });
    });

    describe('email already exists', function () {
        var regResult = {};

        before(function (done) {
            db.users.destroyAll(function () {
                db.logs.destroyAll(function () {
                    reg.applyForMembership({
                            email: 'test@email.com',
                            password: 'pass',
                            confirm: 'pass'},
                        function (err, result) {
                            regResult = result;
                            done();
                        });
                });
            });
        });

        it('is not successful', function(done){
            reg.applyForMembership({
                    email: 'test@email.com',
                    password: 'pass',
                    confirm: 'pass'},
                function (err, result) {
                    regResult = result;
                    regResult.success.should.equal(false);
                    done();
                });
        });


        it('tells the user that email already exists', function(done){
            reg.applyForMembership({
                    email: 'test@email.com',
                    password: 'pass',
                    confirm: 'pass'},
                function (err, result) {
                    regResult = result;
                    regResult.message.should.equal('Email already exists');
                    done();
                });
        });
    });
});
