const _ = require('lodash')
const known = require('./known.json')

var blacklist = {

	report: false,

	known: known,

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
		return this.keywords.find(a => string.includes(a))
	},

	lookup(ipAddress) {
		return known.find(a => a.ipAddress === ipAddress)
	},

}

blacklist.middleware = (req, res, next) =>  {
	var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
		ipAddress = ipAddress ? ipAddress.replace('::ffff:', '') : ipAddress
	if ( blacklist.check(req.originalUrl) || !ipAddress || blacklist.lookup(ipAddress) ) {
		var known = blacklist.known
			known.push({
				offense: req.originalUrl.replace('/', ''),
				ipAddress: ipAddress
			})
		res.status(404).send(blacklist.message)
		return
	}
	next()
}

module.exports = blacklist
