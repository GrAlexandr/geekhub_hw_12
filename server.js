'use strict';

const
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	http = require('http').Server(app),
	contact = require('./constacts/contact'),
	group = require('./groups/group');

let port = process.env.PORT || 3000;

require('./db');

http.listen(port, function () {
	console.log(port);
});

app.use(bodyParser.json());

app.use('/api/v1', contact);
app.use('/api/v1', group);
app.use(express.static(__dirname + '/static/'));

// error handling
app.use((req, res, next) => {
	const err = new Error(`Not Found ${req.path}`);
	err.status = 404;
	next(err);
});

app.use((error, req, res, next) => {
	if (error) {
		console.log(error);
		return res.status(400).json({error});
	}
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;