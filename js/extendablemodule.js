"use strict";
import "css!../css/extendablemodule";
export class ExtendableModule {
    constructor(options) {
        this.element = document.createElement("module");
        this.header = document.createElement("button");
        this.element.setAttribute("type", options.type);
    }
    onfocus() { }
    onblur() { }
}
//# sourceMappingURL=extendablemodule.js.map