define(["require", "exports", "./console", "./domhelper", "css!../css/setup"], function (require, exports, console_1, domhelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var iframe = document.createElementNS(domhelper_1.htmlNamespaceURI, "iframe");
    iframe.src = location.hash.replace("#", "");
    iframe.onload = function () {
        console_1.Console.getConsoleProxy(iframe.contentWindow);
    };
    document.body.appendChild(iframe);
    document.body.appendChild(console_1.Console.element);
});
//# sourceMappingURL=setup.js.map