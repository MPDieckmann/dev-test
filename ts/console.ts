import "ace";
import "./theme/devtools";
import "css!../css/console";
import { DOMHelper, namespaceURI, htmlNamespaceURI } from "./domhelper";
import { Expander } from "./expander";
import { NodeExpander } from "./nodeexpander";
import { PropertyExpander } from "./propertyexpander";

export class Console {
  private static _idCounter: number = 0;
  protected static $frames: Console[] = [];
  public static get frames(): ReadonlyArray<Console> {
    return Console.$frames;
  }
  public static getConsoleProxy(global: Console.Global) {
    var frame: Console = this.$frames.filter(frame => {
      return frame.global === global;
    })[0] || new Console(global);
    return frame.proxy;
  }
  public static element: Element = (() => {
    var consoleElement = document.createElementNS(namespaceURI, "console");
    Console.$lines = document.createElementNS(namespaceURI, "lines");
    consoleElement.appendChild(Console.$lines);
    Console.$output = Console.$lines;
    var inputLine = document.createElementNS(namespaceURI, "input-line");
    var textarea = document.createElementNS(htmlNamespaceURI, "textarea");
    inputLine.appendChild(textarea);
    consoleElement.appendChild(inputLine);

    var $editor = ace.edit(textarea);
    $editor.setOptions({
      autoScrollEditorIntoView: true,
      maxLines: 10,
      mode: "ace/mode/javascript",
      useSoftTabs: true,
      tabSize: 2,
      showFoldWidgets: false,
      showPrintMargin: false,
      cursorStyle: "slim",
      theme: "theme/devtools"
    });
    $editor.renderer.setScrollMargin(3.25, 3.25, 0, 0);
    $editor.commands.addCommands([{
      bindKey: {
        win: "enter"
      },
      name: "execute",
      exec(editor: AceAjax.Editor) {
        if (Console.$activeFrame === null) {
          Console.$createLine(["Fatal Error: no frame is bound to the console"], "error", "top");
          return;
        }
        var value = editor.getValue().trim();
        if (value != "") {
          try {
            var line = document.createElementNS(namespaceURI, "line");
            line.setAttribute("type", "input");
            line.classList.add(editor.renderer.theme.cssClass);
            var lines = editor.renderer.canvas.cloneNode(true);
            while (lines.firstChild && lines.firstChild.textContent == "") {
              lines.removeChild(lines.firstChild);
            }
            while (lines.lastChild && lines.lastChild.textContent == "") {
              lines.removeChild(lines.lastChild);
            }
            line.appendChild(lines);
            Console.$output.appendChild(line);

            Console.$createLine([Console.$eval(Console.$activeFrame.global, value)], "output", Console.$activeFrame.className);
            editor.setValue("");
          } catch (e) {
            Console.$createLine(["Uncaught:", e], "error", Console.$activeFrame.className);
          }
        }
      },
      readOnly: false
    }, {
      bindKey: "shift-enter",
      name: "insert enter",
      exec(editor: AceAjax.Editor) {
        editor.insert("\n");
      },
      readOnly: false
    }, {
      bindKey: "ctrl-l",
      name: "clear console",
      exec() {
        Console.$clear();
      },
      readOnly: false
    }]);
    Console.$editor = $editor;
    Console.$editorType = "ace";

    return consoleElement;
  })();
  protected static $editor: AceAjax.Editor;
  protected static $editorType: string;
  protected static $lines: Element;
  protected static $output: Element;
  protected static $clear() {
    while (Console.$lines.firstChild) {
      Console.$lines.removeChild(Console.$lines.firstChild);
    }
    Console.$output = Console.$lines;
  }
  protected static $activeFrame: Console = null;
  public static get activeFrame(): Console {
    return this.$activeFrame;
  }
  protected static $eval(global: Console.Global, code: string) {
    return global.eval.call(null, code);
  }
  protected static $toString(value: any): string {
    switch (typeof value) {
      case "boolean":
      case "function":
      case "number":
      case "string":
      case "symbol":
        return value.toString();
      case "object":
        if (value === null) {
          return "null";
        }
        if ("toString" in value && typeof value.toString == "function") {
          return value.toString();
        }
        return Object.prototype.toString.call(value);
      case "undefined":
        return "undefined";
    }
  }
  protected static $createLine(args: IArguments | any[], type: string, className: string) {
    var line = document.createElementNS(namespaceURI, "line");
    var index = 0;
    var length = args.length;
    if (typeof args[0] == "string") {
      var regexp = /%[sidfoOc]/;
      var tmp: Element = line;
      index++;
      args[0].split(/(%[sidfoOc])/).forEach(str => {
        if (regexp.test(str) && index < length) {
          switch (str) {
            case "%s":
              tmp.appendChild(new PropertyExpander({
                property: this.$toString(args[index++])
              }).element);
              break;
            case "%i":
            case "%d":
              tmp.appendChild(new PropertyExpander({
                property: parseInt(this.$toString(args[index++]))
              }).element);
              break;
            case "%f":
              tmp.appendChild(new PropertyExpander({
                property: parseFloat(this.$toString(args[index++]))
              }).element);
              break;
            case "%o":
              if (typeof args[index] == "object" && args[index] instanceof Node) {
                tmp.appendChild(new NodeExpander({
                  node: args[index++]
                }).element);
                break;
              }
            case "%O":
              tmp.appendChild(new PropertyExpander({
                property: args[index++]
              }).element);
              break;
            case "%c":
              let tmp2 = document.createElementNS(namespaceURI, "font");
              tmp2.setAttribute("style", args[index++]);
              tmp.appendChild(tmp2);
              tmp = tmp2;
              break;
          }
        } else {
          tmp.appendChild(document.createTextNode(str));
        }
      });
    }
    for (index; index < length; index++) {
      try {
        if (typeof args[index] == "string") {
          line.appendChild(document.createTextNode(" " + args[index]));
        } else if (typeof args[index] == "object" && "nodeType" in args[index]) {
          line.appendChild(new NodeExpander({
            node: args[index]
          }).element);
        } else {
          line.appendChild(new PropertyExpander({
            property: args[index]
          }).element);
        }
      } catch (e) {
        line.appendChild(new PropertyExpander({
          property: args[index]
        }).element);
      }
    }
    line.setAttribute("type", type);
    line.classList.add(className);
    Console.$output.appendChild(line);
    return line;
  }

  protected $counter: { [s: string]: number } = {};
  protected static $groups: Element[] = [];
  protected $timer: { [s: string]: number } = {};

  protected constructor(public readonly global: Console.Global) {
    this.className = "frame-" + Console._idCounter++;
    Console.$frames.push(this);
    Console.$activeFrame = this;
    global.addEventListener("error", event => {
      this.$createLine(["Uncaught:", {
        colno: event.colno,
        error: event.error,
        filename: event.filename,
        lineno: event.lineno,
        message: event.message,
        event: event,
        [Symbol.toStringTag]: event.message || "Error"
      }], "error");
    });
    global.addEventListener("unload", event => {
      if (event.isTrusted) {
        Console.$frames.splice(Console.$frames.indexOf(this), 1);
      }
    });
    // @ts-ignore
    global.console = this;
    global[namespaceURI + "/console"] = this;
  }
  protected $functions: PropertyKey[] = [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "time",
    "timeEnd",
    "warn"
  ];
  protected $createLine(args: IArguments | any[], type: string): Element {
    return Console.$createLine(args, type, this.className);
  }

  public readonly className: string;
  public readonly proxy = ((console: Console) => new Proxy(console.global.console, {
    get: (target, p, receiver): any => {
      if (p in target === false) {
        return;
      }
      if (console.$functions.indexOf(p) >= 0 && p in console) {
        return function () {
          console[p].apply(console, arguments);
          return target[p].apply(target, arguments);
        }
      }
      return target[p];
    }
  }))(this);
  public assert(test: boolean, message?: any, ...optionalParams: any[]) {
    optionalParams.unshift(message);
    if (typeof message == "string") {
      optionalParams[0] = "Assertion Failed: " + optionalParams[0];
    } else {
      optionalParams.unshift("Assertion Failed");
    }
    this.$createLine(optionalParams, "error");
  }
  public clear() {
    Console.$clear();
    this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"], "log");
  }
  public count(countTitle?: string) {
    var $countTitle = "$" + countTitle;
    if ($countTitle in this.$counter === false) {
      this.$counter[$countTitle] = 0;
    }
    if (countTitle) {
      this.log(countTitle, ++this.$counter[$countTitle]);
    } else {
      this.log(++this.$counter[$countTitle]);
    }
  }
  public debug(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "debug");
  }
  public dir(value: any) {
    this.$createLine(["%O", value], "dir");
  }
  public dirxml(value: any) {
    this.$createLine(["%o", value], "dirxml");
  }
  public error(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "error");
  }
  public group(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.element.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.group"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    expander.expand();
    Console.$groups.push(Console.$output);
    DOMHelper.replaceChild(expander.element, line);
    Console.$output = expander.element;
  }
  public groupCollapsed(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.element.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.groupCollapsed"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    Console.$groups.push(Console.$output);
    DOMHelper.replaceChild(expander.element, line);
    Console.$output = expander.element;
  }
  public groupEnd() {
    if (0 in Console.$groups) {
      Console.$output = Console.$groups.pop();
    }
  }
  public info(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "info");
  }
  public log(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "log");
  }
  public time(timerName?: string) {
    var $timerName = "$" + timerName;
    if ($timerName in this.$timer === false) {
      this.$timer[$timerName] = Date.now();
    }
  }
  public timeEnd(timerName?: string) {
    var $timerName = "$" + timerName;
    var $time = 0;
    if ($timerName in this.$timer) {
      $time = Date.now() - this.$timer[$timerName];
      delete this.$timer[$timerName];
    }
    this.log("%s: %fms", timerName || "default", $time);
  }
  public warn(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "warn");
  }
}
export namespace Console {
  export interface Global extends Window {
    eval(code: string): any;
  }
}