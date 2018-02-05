import "css!../css/setup";
import { Console } from "./console";

var iframe = document.createElement("iframe");
iframe.src = location.hash.replace("#", "");
iframe.onload = function () {
  Console.getConsoleProxy(iframe.contentWindow);
}
document.body.appendChild(iframe);
document.body.appendChild(Console.element);