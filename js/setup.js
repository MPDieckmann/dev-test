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
    var iframe = document.createElement("iframe");
    iframe.src = location.hash.replace("#", "");
    iframe.onload = function () {
        console_1.Console.getConsoleProxy(iframe.contentWindow);
    };
    document.body.appendChild(iframe);
    document.body.appendChild(console_1.Console.element);
});
//# sourceMappingURL=setup.js.map