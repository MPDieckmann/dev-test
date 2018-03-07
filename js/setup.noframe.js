define(["require", "exports", "./console"], function (require, exports, console_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    document.body.appendChild(console_1.Console.element);
    // @ts-ignore
    self.console = self["mpdieckmann.github.io/dev-test"].console = console_1.Console.getConsoleProxy(self);
});
//# sourceMappingURL=setup.noframe.js.map