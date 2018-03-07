import { Console } from "./console";

var doc = document;
try {
  doc = top.document;
} catch (e) { }
var element = doc.body ? doc.body : doc.firstElementChild;
element.appendChild(Console.element);

Console.getConsoleProxy(<Console.Global>(doc === document ? self : top));