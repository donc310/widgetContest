const clone = require("lodash/clone")

var config ={
    name:'',
    states:[1,2,2,2,2,2],
    f:[{},{}]

}
var clonedconfig =  clone(config);
config.name = ""
clonedconfig.name = "christian";
console.log(config.name)
console.log(clonedconfig.name)
config.name = "me"
console.log(clonedconfig.name)
console.log(config.name)


