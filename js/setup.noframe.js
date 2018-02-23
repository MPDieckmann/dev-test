"use strict";
import "css!../css/setup";
import { Console } from "./console";
if (document.body.firstChild) {
    document.body.insertBefore(Console.element, document.body.firstChild);
}
else {
    document.body.appendChild(Console.element);
}
window.console = Console.getConsoleProxy(window);
//# sourceMappingURL=setup.noframe.js.map