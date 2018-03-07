define(["require", "exports", "./console"], function (require, exports, console_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var doc = document;
    try {
        doc = top.document;
    }
    catch (e) { }
    var element = doc.body ? doc.body : doc.firstElementChild;
    element.appendChild(console_1.Console.element);
    console_1.Console.getConsoleProxy((doc === document ? self : top));
});
//# sourceMappingURL=setup.noframe.js.map