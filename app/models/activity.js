var mongoose = require('mongoose');

module.exports = mongoose.model('Activity', {
	activityName : String,
	activityTime: Number,
	activityDay: Number,
	activityMonth: Number,
	activityYear: Number
});