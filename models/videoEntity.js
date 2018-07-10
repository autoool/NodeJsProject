var mongoose = require('mongoose');
var videoSchema = new mongoose.Schema({
    title:String,
    description:String,
    tags:[String],
    status:{type:Number,default:1},//1 有效 0 无效
    videoPath:String,
    createAt:{type:Date,default:Date.now()},
    updateAt:{type:Date,default:Date.now()},
});
videoSchema.pre('save',function(next){
    if(this.isNew){
        this.createAt = this.updateAt = Date.now();
    }else{
        this.updateAt = Date.now();
    }
    next();
});
videoSchema.statics={
    fetch:function(cb){
        return this
        .find({})
        .sort({'createAt':'asc'})
        .exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({_id:id}).exec(cb);
    },
    findByTitle:function(title,cb){
        return this.findOne({title:title}).exec(cb);
    },
};

var VideoEntity = mongoose.model('video',videoSchema);
module.exports = VideoEntity;
