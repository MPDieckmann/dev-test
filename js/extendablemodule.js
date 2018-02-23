(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "css!../css/extendablemodule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("css!../css/extendablemodule");
    class ExtendableModule {
        constructor(options) {
            this.element = document.createElement("module");
            this.header = document.createElement("button");
            this.element.setAttribute("type", options.type);
        }
        onfocus() { }
        onblur() { }
    }
    exports.ExtendableModule = ExtendableModule;
});
//# sourceMappingURL=extendablemodule.js.map