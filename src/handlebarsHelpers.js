const handlebars = require('hbs');

handlebars.registerHelper('not', function(value, options) {
    return !value;
});

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

module.exports = handlebars;