'use strict';

const mongoose = require('mongoose');

const contactShema = new mongoose.Schema({
	name: String,
	phone: String,
	category: Array
});

module.exports = mongoose.model('Contact', contactShema);