'use strict';

const
	express = require('express'),
	Group = require('./model'),
	router = express.Router();

router.get('/groups', (req, res, next) => {
	Group.find({})
		.then(groups => {
			res.json({groups});
		})
		.catch(next);
});

router.post('/groups', (req, res, next) => {
	new Group(req.body)
		.save()
		.then(group => {
			res.json({group})
		})
		.catch(next);
});

router.delete('/group/:id', (req, res, next) => {
	Group.remove({_id: req.params.id}, function (err, result) {
		if(err) {
			console.log(err);
		}
		console.log(result);
		res.json({
			"status": "ok"
		});
	})
});

router.put('/group/:id', (req, res, next) => {
	Group.update({'_id' : req.params.id},
		{$set: req.body},
		function (err, result) {
			if (err) throw err;
			console.log(result);
		});
	Group.find({_id: req.params.id})
		.then(group => {
			res.json({group});
		})
		.catch(next);
});

module.exports = router;