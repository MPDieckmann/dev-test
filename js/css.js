define(["require", "exports", "./domhelper"], function (require, exports, domhelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function load(name, req, onload, config) {
        var link = document.createElementNS(domhelper_1.htmlNamespaceURI, "link");
        link.href = req.toUrl(name + ".css");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.onload = onload;
        document.head.appendChild(link);
    }
    exports.load = load;
});
//# sourceMappingURL=css.js.map