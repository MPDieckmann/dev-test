import "css!../css/extendablemodule";
import { namespaceURI } from "./domhelper";

export class ExtendableModule {
  public element = document.createElementNS(namespaceURI, "module");
  public header = document.createElementNS(namespaceURI, "button");
  protected constructor(options: ExtendableModule.Options) {
    this.element.setAttribute("type", options.type);
  }
  public onfocus() { }
  public onblur() { }
}
declare namespace ExtendableModule {
  interface Options {
    name: string,
    type: string
  }
}