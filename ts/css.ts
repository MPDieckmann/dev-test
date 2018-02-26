import { htmlNamespaceURI } from "./domhelper";

export function load(name: string, req: Require, onload: {
  (): void;
  error(): void;
  fromText(text: string, textAlt: string): void;
}, config: RequireConfig) {
  var link = <HTMLLinkElement>document.createElementNS(htmlNamespaceURI, "link");
  link.href = req.toUrl(name + ".css");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.onload = onload;
  document.head.appendChild(link);
}