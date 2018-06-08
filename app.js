import express from 'express';
var Person= require('./usertest');


let app = express();
app.get('/', (res, req) => {

})
app.listen(3000, (res) => {
	Person.say();
Person.sayHello();
});