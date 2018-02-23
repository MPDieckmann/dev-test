(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "css!../css/setup", "./console"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("css!../css/setup");
    const console_1 = require("./console");
    if (document.body.firstChild) {
        document.body.insertBefore(console_1.Console.element, document.body.firstChild);
    }
    else {
        document.body.appendChild(console_1.Console.element);
    }
    window.console = console_1.Console.getConsoleProxy(window);
});
//# sourceMappingURL=setup.noframe.js.map