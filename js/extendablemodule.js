define(["require", "exports", "css!../css/extendablemodule"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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