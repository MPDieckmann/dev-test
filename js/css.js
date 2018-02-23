"use strict";
export function load(name, req, onload, config) {
    var link = document.createElement("link");
    link.href = req.toUrl(name + ".css");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.onload = onload;
    document.head.appendChild(link);
}
//# sourceMappingURL=css.js.map