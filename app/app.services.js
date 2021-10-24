const { warQuotes } = require('./app.constants');

module.exports.randomWarQuote = () =>
	warQuotes[Math.floor(Math.random() * warQuotes.length)];
