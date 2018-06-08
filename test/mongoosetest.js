var mongoose = require('mongoose');
var cre = require('../credentials');
var userModel = require('../test/module/user');
var addressModel = require('../test/module/address');

mongoose.connect(cre.mongo.development.connectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('connect');
});
var address1 = addressModel({
  province: '1',
  city: '2',
  detail: '333'
});
/*  address1.save(function (err) {
  if (err) {
    console.log(err)
    return
  }

  var userone = userModel({
    nickname: '张三',
    gender: '1',
    avatar: '123',
    address:address1._id,  
  });
  userone.save(function (err) {
    if (err) {
      console.log(err)
      return
    }
  })
})  */
const query = userModel.find().where('nickname').equals('');
query.then((res)=>{
  console.log('query')
})