var mongoose = require('mongoose');
var vacationInseasonListenerSchema = mongoose.Schema({
    email: String,
    skus: [String],
});
var vacationInseasonListener = mongoose.model('VacationInseanListener',
    vacationInseasonListenerSchema);
module.exports = vacationInseasonListener;