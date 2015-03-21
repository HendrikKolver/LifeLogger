var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	activityName : String,
	activityTime: Number,
	activityDay: Number,
	activityMonth: Number,
	activityYear: Number
});