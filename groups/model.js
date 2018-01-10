'use strict';

const mongoose = require('mongoose');

const groupShema = new mongoose.Schema({
	title: String,
});

module.exports = mongoose.model('Group', groupShema);