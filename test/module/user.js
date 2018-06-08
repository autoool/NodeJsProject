var mongoose = require('mongoose');
Schema = mongoose.Schema;
var userChema = Schema({
    nickname:String,
    gender:String,
    avatar:String,
    createAt:{type:Date,default:Date.now()},
    updateAt:{type:Date,default:Date.now()},
    openId:String,
    unionId:String,
    address:{
        type:Schema.Types.ObjectId,ref:'Address'
    },
    sessionKey:String
});

var User = mongoose.model('User',userChema);
module.exports = User;
