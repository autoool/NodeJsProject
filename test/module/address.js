var mongoose = require('mongoose');
Schema = mongoose.Schema;
var addressSchema = Schema({
    province:String,
    city:String,
    detail:String,
    createAt:{type:Date,default:Date.now()},
    updateAt:{type:Date,default:Date.now()}
});

var Address = mongoose.model('Address',addressSchema);
module.exports = Address;