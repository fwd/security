const known = require('./known.json')

module.exports = {

	message: `You've been banned from using this service.`,

	keywords: [
	    '.php',
	    '.cgi',
	    '.jsp',
	    '.env',
	    '.HNAP1',
	    'joomla',
	    'phpstorm',
	    'mysql',
	    'formLogin',
	    'phpunit',
	    'muieblackcat',
	    'wp-includes',
	    'wp-content',
	    'jsonws',
	    'phpmyadmin',
	    'phpadmin',
	    'netgear',
	    'boaform',
	],


	check(string) {
		return new RegExp(this.keywords.join("|")).test(string.toLowerCase())
	},

	lookup(ipAddress) {
		return known.find(a => a.ipAddress === ipAddress)
	},

	known() {
		return known
	},

	middleware(req, res, next) {
		var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
			ipAddress = ipAddress ? ipAddress.replace('::ffff:', '')
		if ( this.check(req.originalUrl) || this.lookup(ipAddress) ) {
			res.status(404).send(this.message)
			return
		}
		next()
	},

}
