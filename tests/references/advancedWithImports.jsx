var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "inferno", "inferno-component", "./components/Incrementer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Inferno = require("inferno");
    var createComponentVNode = Inferno.createComponentVNode;
    var createVNode = Inferno.createVNode;
    var inferno_1 = require("inferno");
    var inferno_component_1 = require("inferno-component");
    var Incrementer_1 = require("./components/Incrementer");
    var container = document.getElementById("app");
    var MyComponent = (function (_super) {
        __extends(MyComponent, _super);
        function MyComponent(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.tsxVersion = 2.34; /* This is typed value */
            return _this;
        }
        MyComponent.prototype.render = function () {
            return (createVNode(1, "div", null, [createVNode(1, "h1", null, "Welcome to Inferno " + inferno_1.version + " TSX " + this.tsxVersion, 0), createComponentVNode(2, Incrementer_1.Incrementer, { "name": "Crazy button" })], 4));
        };
        return MyComponent;
    }(inferno_component_1.default));
    inferno_1.render(createComponentVNode(2, MyComponent), container);
});
