class Person {
	constructor(){

	}
  say() {
    console.log('hello');
  }

  async sayHello(){
	console.log(' say hello');
  }
}
module.exports = new Person();