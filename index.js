const fs = require('fs')
const _ = require('lodash')

const security = {

	headers: {},

	known: fs.readFileSync( __dirname + '/blacklist.txt').toString().split("\n"),

	banned: [],

	message: `You've been banned from using this service.`,

	check(string, array) {
		return new RegExp(array ? array.join("|") : this.known.join("|")).test(string)
	},

	lookup(ip) {
		return this.banned.find(a => a.ip === ip)
	},

}

security.firewall = (req, res, next) =>  {
	
	var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
		ipAddress = ipAddress ? ipAddress.replace('::ffff:', '') : ipAddress
		
	var requestedUrl = req.originalUrl.replace('/', '')

	if ( ipAddress && security.check(requestedUrl) ) {
		security.banned.push({
			req: req,
			offense: requestedUrl,
			ip: ipAddress
		})
	}

	if ( !ipAddress || security.lookup(ipAddress) && (security.allow && !security.allow(req)) ) {

		if (security.handler ) {
			req.offense = requestedUrl
			req.ip = ipAddress
			security.handler(req, res, next)
			return
		}

		res.status(404).send(security.message)

		return

	}

	next()

}

module.exports = security
