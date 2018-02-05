import CodeMirror from "codemirror";
import { DOMHelper } from "./domhelper";
import { ExtendableModule } from "./extendablemodule";
import { Expander } from "./expander";
import { PropertyExpander } from "./propertyexpander";
import { NodeExpander } from "./nodeexpander";

export class ConsoleModule extends ExtendableModule {
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
  private _originalConsole: Console;
  private _proxiedConsole: Console;
  private _createConsoleProxy() {
    var $this = this;
    this._originalConsole = this.global.console;
    this.global.console = new Proxy(this.global.console, {
      get(target: Console, p: PropertyKey, receiver: any): any {
        if (p in target === false) {
          return;
        }
        if ($this.$functions.indexOf(p) >= 0 && p in $this) {
          return function () {
            $this[p].apply($this, arguments);
            return target[p].apply(target, arguments);
          }
        }
        return target[p];
      }
    });
    this._proxiedConsole = this.global.console;
  }
  private _createInputLine() {
    this.element.appendChild(this.$lines);
    var $input = document.createElement("input-line");
    var $textarea = document.createElement("textarea");
    $input.appendChild($textarea);
    this.element.appendChild($input);
    var $this = this;

    this.$editor = CodeMirror.fromTextArea($textarea, {
      mode: "javascript",
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      extraKeys: {
        Enter(codeMirror: CodeMirror.Editor) {
          var value = codeMirror.getValue().trim();
          if (value != "") {
            try {
              var line = document.createElement("line");
              line.setAttribute("type", "input");
              $this.$output.appendChild(line);
              CodeMirror(line, {
                mode: "javascript",
                tabSize: 2,
                readOnly: true,
                value: value
              });

              $this.$createLine([$this.$eval(value)], "output");
              codeMirror.setValue("");
            } catch (e) {
              $this.$createLine(["Uncaught:", e], "error");
            }
          }
        },
        "Shift-Enter"(codeMirror: CodeMirror.Doc) {
          codeMirror.replaceSelection("\n");
        },
        "Ctrl-L"() {
          $this.$clear();
        }
      }
    });
  }
  constructor(public readonly global: ConsoleModule.Global) {
    super({
      name: "Console",
      type: "console"
    });

    this._createConsoleProxy();
    this._createInputLine();

    this.global.addEventListener("error", (event: ErrorEvent) => {
      var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
      if ("colno" in event) {
        args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
        args.push(event.colno);
      }
      this.$createLine(args, "error");
    });
  }
  protected $editorConstructor = "CodeMirror";
  protected $editor: CodeMirror.Editor;
  protected $lines: Element = document.createElement("lines");
  protected $output: Element = this.$lines;
  protected $eval(code) {
    return eval.call(null, code);
  }
  protected $toString(value: any): string {
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
  protected $createLine(args: IArguments | any[], type?: string) {
    var line = document.createElement("line");
    var index = 0;
    var length = args.length;
    if (typeof args[0] == "string") {
      var regexp = /%[sidfoOc]/;
      var tmp: HTMLElement = line;
      index++;
      args[0].split(/(%[sidfoOc])/).forEach(str => {
        if (regexp.test(str) && index < length) {
          switch (str) {
            case "%s":
              tmp.appendChild(new PropertyExpander({
                property: this.$toString(args[index++])
              }).details);
              break;
            case "%i":
            case "%d":
              tmp.appendChild(new PropertyExpander({
                property: parseInt(this.$toString(args[index++]))
              }).details);
              break;
            case "%f":
              tmp.appendChild(new PropertyExpander({
                property: parseFloat(this.$toString(args[index++]))
              }).details);
              break;
            case "%o":
              if (typeof args[index] == "object" && args[index] instanceof Node) {
                tmp.appendChild(new NodeExpander({
                  node: args[index++]
                }).details);
                break;
              }
            case "%O":
              tmp.appendChild(new PropertyExpander({
                property: args[index++]
              }).details);
              break;
            case "%c":
              let tmp2 = document.createElement("font");
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
      if (typeof args[index] == "string") {
        line.appendChild(document.createTextNode(" " + args[index]));
      } else if (typeof args[index] == "object" && args[index] instanceof Node) {
        line.appendChild(new NodeExpander({
          node: args[index]
        }).details);
      } else {
        line.appendChild(new PropertyExpander({
          property: args[index]
        }).details);
      }
    }
    if (type) {
      line.setAttribute("type", type);
    }
    this.$output.appendChild(line);
    return line;
  }
  protected $clear() {
    while (this.$lines.firstChild) {
      DOMHelper.remove(this.$lines.firstChild);
    }
    this.$output = this.$lines;
  }
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
    this.$clear();
    this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
  }
  protected $counter: { [s: string]: number } = {};
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
  protected $groups: Element[] = [];
  public group(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.details.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.group"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    expander.summary.click();
    this.$groups.push(this.$output);
    DOMHelper.replaceChild(expander.details, line);
    this.$output = expander.details;
  }
  public groupCollapsed(groupTitle?: string, ...optionalParams: any[]) {
    var expander = new Expander({
      label: ""
    });
    expander.expandable = true;
    expander.details.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.groupCollapsed"], "group");
    while (line.firstChild) {
      expander.summary.appendChild(line.firstChild);
    }
    this.$groups.push(this.$output);
    DOMHelper.replaceChild(expander.details, line);
    this.$output = expander.details;
  }
  public groupEnd() {
    if (0 in this.$groups) {
      this.$output = this.$groups.pop();
    }
  }
  public info(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "info");
  }
  public log(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "log");
  }
  protected $timer: { [s: string]: number } = {};
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
namespace ConsoleModule {
  export interface Global extends Window {
    console: Console;
  }
}