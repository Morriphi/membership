var should = require('should');
var Log = require('../models/log');

describe('Log', function () {
    describe('defaults', function () {
        it('requires subject', function () {
            should(function () {
                new Log({entry: 'entry', userId: 'userId'});
            }).throw('Need subject, entry and user id');
        });

        it('requires entry', function () {
            should(function () {
                new Log({subject: 'subject', userId: 'userId'});
            }).throw('Need subject, entry and user id');
        });

        it('requires userId', function () {
            should(function () {
                new Log({subject: 'subject', entry: 'entry'});
            }).throw('Need subject, entry and user id');
        });

        it('has createdAt', function(){
            new Log({subject: 'subject', entry: 'entry', userId: 'userId'})
                .createdAt.should.be.defined;
        });
    });
});