'use strict';
var aa123 = 1;

console.log(aa123);

var strEval = 'var aa123=2;console.log(aa123)';

eval(strEval);
console.log(aa123);
