var __classwrap = function(classes, prefix) {
  var value
  var className = ""
  var type = typeof classes
  if ((classes && type === "string") || type === "number") {
    return classes
  }
  prefix = prefix || " "
  if (Array.isArray(classes) && classes.length) {
    for (var i = 0, l = classes.length; i < l; i++) {
      if ((value = __classwrap(classes[i], prefix))) {
        className += (className && prefix) + value
      }
    }
  } else {
    for (var i in classes) {
      if (classes.hasOwnProperty(i) && (value = classes[i])) {
        className +=
          (className && prefix) +
          i +
          (typeof value === "object" ? __classwrap(value, prefix + i) : "")
      }
    }
  }
  return className
}
var Inferno = require("inferno");
var createVNode = Inferno.createVNode;
createVNode(2, "div", __classwrap(variable), "1");
