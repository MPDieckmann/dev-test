(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function load(name, req, onload, config) {
        var link = document.createElement("link");
        link.href = req.toUrl(name + ".css");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.onload = onload;
        document.head.appendChild(link);
    }
    exports.load = load;
});
//# sourceMappingURL=css.js.map