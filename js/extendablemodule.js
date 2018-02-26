define(["require", "exports", "./domhelper", "css!../css/extendablemodule"], function (require, exports, domhelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExtendableModule {
        constructor(options) {
            this.element = document.createElementNS(domhelper_1.namespaceURI, "module");
            this.header = document.createElementNS(domhelper_1.namespaceURI, "button");
            this.element.setAttribute("type", options.type);
        }
        onfocus() { }
        onblur() { }
    }
    exports.ExtendableModule = ExtendableModule;
});
//# sourceMappingURL=extendablemodule.js.map