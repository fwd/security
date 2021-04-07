const fs = require('fs')
const _ = require('lodash')

const blacklist = {

	remember: true,

	report: false,

	exclude: [],

	known: fs.readFileSync('./blacklist.txt').toString().split("\n"),

	banned: [],

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

blacklist.firewall = (req, res, next) =>  {
	
	var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
		ipAddress = ipAddress ? ipAddress.replace('::ffff:', '') : ipAddress
	
	if ( ipAddress && new RegExp(blacklist.known.join("|")).test(req.originalUrl) && !(new RegExp(blacklist.exclude.join("|")).test(req.originalUrl)) ) {
		blacklist.banned.push({
			offense: req.originalUrl.replace('/', ''),
			ip: ipAddress
		})
	}

	if ( !ipAddress || blacklist.banned.find(a => a.ip == ipAddress) ) {
		res.status(404).send(blacklist.message)
		return
	}

	next()

}

module.exports = blacklist
