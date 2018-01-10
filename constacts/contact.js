'use strict';

const express = require('express'),
	Contact = require('./model'),
	router = express.Router();

router.get('/contacts', (req, res, next) => {
	Contact.find({})
		.then(contacts => {
			res.json({contacts});
		})
		.catch(next);
});

router.post('/contacts', (req, res, next) => {
	new Contact(req.body)
		.save()
		.then(contact => {
			res.json({contact})
		})
		.catch(next);
});

router.delete('/contact/:id', (req, res, next) => {
	Contact.remove({_id: req.params.id}, function (err, result) {
		if(err) {
			console.log(err);
		}
		console.log(result);
		res.json({
			"status": "ok"
		});
	})
});

router.put('/contact/:id', (req, res, next) => {
	Contact.update({'_id' : req.params.id},
		{$set: req.body},
		function (err, result) {
			if (err) throw err;
			console.log(result);
		});
	Contact.find({_id: req.params.id})
		.then(contact => {
			res.json({contact});
		})
		.catch(next);
});

module.exports = router;