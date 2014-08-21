var Application = function (args) {
    var self = this;

    self.email = args.email;
    self.password = args.password;
    self.confirm = args.confirm;
    self.status = 'pending';
    self.message = null;
    self.user = null;

    self.validate = function (success, fail) {
        if (!self.email)
            setInvalid('Email is required', fail);
        else if (!self.password)
            setInvalid('Password is required', fail);
        else if (self.password !== self.confirm)
            setInvalid('Passwords don\'t match', fail);
        else
            setValid(success);
    };

    function setValid(callback) {
        self.status = 'validated';
        callback(self);
    };

    function setInvalid(message, callback) {
        self.status = 'invalid';
        self.message = message;
        callback(self);
    };
};

module.exports = Application;
