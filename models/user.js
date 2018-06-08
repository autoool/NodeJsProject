var mongoose = require('mongoose');
var userChema = new mongoose.Schema({
    nickname:String,
    gender:String,
    avatar:String,
    createAt:{type:Date,default:Date.now()},
    updateAt:{type:Date,default:Date.now()},
    openId:String,
    unionId:String,
    sessionKey:String
});
userChema.pre('save',function(next){
    if(this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});
userChema.statics={
    fetch:function(cb){
        return this
        .find({})
        .sort({'createAt':'asc'})
        .exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).exec(cb);
    },
    findByOpenId:function(openId,cb){
        return this.findOne({openId:openId}).exec(cb);
    },
};

var User = mongoose.model('users',userChema);
module.exports = User;
