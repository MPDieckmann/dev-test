import "css!../css/setup";
import { Console } from "./console";
import { htmlNamespaceURI } from "./domhelper";

var iframe = <HTMLIFrameElement>document.createElementNS(htmlNamespaceURI, "iframe");
iframe.src = location.hash.replace("#", "");
iframe.onload = function () {
  Console.getConsoleProxy(<Console.Global>iframe.contentWindow);
}
document.body.appendChild(iframe);
document.body.appendChild(Console.element);