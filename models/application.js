var Application = function (args) {
    var app = {};
    app.email = args.email;
    app.password = args.password;
    app.confirm = args.confirm;
    app.status = 'pending';
    app.message = null;

    app.validate = function (message){
        app.status = 'validated';
    };

    app.isValid = function () {
        return app.status === 'validated';
    };

    app.isInvalid = function () {
        return !app.isValid();
    };

    app.setInvalid = function (message) {
        app.status = 'invalid';
        app.message = message;
    };

    app.validateInputs = function(){
        if(!app.email){
            app.setInvalid('Email is required');
            return;
        };

        if(!app.password){
            app.setInvalid('Password is required');
            return;
        }

        if(!app.email || !app.password){
            app.setInvalid('Email and password are required');
        } else if(app.password !== app.confirm){
            app.setInvalid('Passwords don\'t match');
        } else {
            app.validate();
        }
    };

    return app;
};

module.exports = Application;
