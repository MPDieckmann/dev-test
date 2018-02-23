import { Console } from "./console";
document.body.appendChild(Console.element);
// @ts-ignore
window.console = Console.getConsoleProxy(<Console.Global>window);