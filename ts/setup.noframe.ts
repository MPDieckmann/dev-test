import { Console } from "./console";
document.body.appendChild(Console.element);
// @ts-ignore
self.console = self["mpdieckmann.github.io/dev-test"].console = Console.getConsoleProxy(<Console.Global>self);