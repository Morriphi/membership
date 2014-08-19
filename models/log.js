var assert = require('assert');

var Log = function(args){
    assert.ok(args.subject && args.entry && args.userId, 'Need subject, entry and user id');
    var log = {};
    log.suject = args.subject;
    log.entry = args.entry;
    log.userId = args.userId;
    log.createdAt = new Date();
    return log;
}

module.exports = Log;
