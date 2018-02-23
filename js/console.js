(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ace", "./theme/devtools", "css!../css/console", "./domhelper", "./expander", "./nodeexpander", "./propertyexpander"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("ace");
    require("./theme/devtools");
    require("css!../css/console");
    const domhelper_1 = require("./domhelper");
    const expander_1 = require("./expander");
    const nodeexpander_1 = require("./nodeexpander");
    const propertyexpander_1 = require("./propertyexpander");
    class Console {
        constructor(global) {
            this.global = global;
            this.$counter = {};
            this.$timer = {};
            this.$functions = [
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
            this.proxy = ((console) => new Proxy(console.global.console, {
                get: (target, p, receiver) => {
                    if (p in target === false) {
                        return;
                    }
                    if (console.$functions.indexOf(p) >= 0 && p in console) {
                        return function () {
                            console[p].apply(console, arguments);
                            return target[p].apply(target, arguments);
                        };
                    }
                    return target[p];
                }
            }))(this);
            this.className = "frame-" + Console._idCounter++;
            Console.$frames.push(this);
            Console.$activeFrame = this;
            global.addEventListener("unload", event => {
                if (event.isTrusted) {
                    Console.$frames.splice(Console.$frames.indexOf(this), 1);
                }
            });
        }
        static get frames() {
            return Console.$frames;
        }
        static getConsoleProxy(global) {
            var frame = this.$frames.filter(frame => {
                return frame.global === global;
            })[0] || new Console(global);
            return frame.proxy;
        }
        static $clear() {
            while (Console.$lines.firstChild) {
                Console.$lines.removeChild(Console.$lines.firstChild);
            }
            Console.$output = Console.$lines;
        }
        static get activeFrame() {
            return this.$activeFrame;
        }
        static $eval(global, code) {
            return global.eval.call(null, code);
        }
        static $toString(value) {
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
        static $createLine(args, type, className) {
            var line = document.createElement("line");
            var index = 0;
            var length = args.length;
            if (typeof args[0] == "string") {
                var regexp = /%[sidfoOc]/;
                var tmp = line;
                index++;
                args[0].split(/(%[sidfoOc])/).forEach(str => {
                    if (regexp.test(str) && index < length) {
                        switch (str) {
                            case "%s":
                                tmp.appendChild(new propertyexpander_1.PropertyExpander({
                                    property: this.$toString(args[index++])
                                }).element);
                                break;
                            case "%i":
                            case "%d":
                                tmp.appendChild(new propertyexpander_1.PropertyExpander({
                                    property: parseInt(this.$toString(args[index++]))
                                }).element);
                                break;
                            case "%f":
                                tmp.appendChild(new propertyexpander_1.PropertyExpander({
                                    property: parseFloat(this.$toString(args[index++]))
                                }).element);
                                break;
                            case "%o":
                                if (typeof args[index] == "object" && args[index] instanceof Node) {
                                    tmp.appendChild(new nodeexpander_1.NodeExpander({
                                        node: args[index++]
                                    }).element);
                                    break;
                                }
                            case "%O":
                                tmp.appendChild(new propertyexpander_1.PropertyExpander({
                                    property: args[index++]
                                }).element);
                                break;
                            case "%c":
                                let tmp2 = document.createElement("font");
                                tmp2.setAttribute("style", args[index++]);
                                tmp.appendChild(tmp2);
                                tmp = tmp2;
                                break;
                        }
                    }
                    else {
                        tmp.appendChild(document.createTextNode(str));
                    }
                });
            }
            for (index; index < length; index++) {
                try {
                    if (typeof args[index] == "string") {
                        line.appendChild(document.createTextNode(" " + args[index]));
                    }
                    else if (typeof args[index] == "object" && "nodeType" in args[index]) {
                        line.appendChild(new nodeexpander_1.NodeExpander({
                            node: args[index]
                        }).element);
                    }
                    else {
                        line.appendChild(new propertyexpander_1.PropertyExpander({
                            property: args[index]
                        }).element);
                    }
                }
                catch (e) {
                    line.appendChild(new propertyexpander_1.PropertyExpander({
                        property: args[index]
                    }).element);
                }
            }
            line.setAttribute("type", type);
            line.classList.add(className);
            Console.$output.appendChild(line);
            return line;
        }
        $createLine(args, type) {
            return Console.$createLine(args, type, this.className);
        }
        assert(test, message, ...optionalParams) {
            optionalParams.unshift(message);
            if (typeof message == "string") {
                optionalParams[0] = "Assertion Failed: " + optionalParams[0];
            }
            else {
                optionalParams.unshift("Assertion Failed");
            }
            this.$createLine(optionalParams, "error");
        }
        clear() {
            Console.$clear();
            this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"], "log");
        }
        count(countTitle) {
            var $countTitle = "$" + countTitle;
            if ($countTitle in this.$counter === false) {
                this.$counter[$countTitle] = 0;
            }
            if (countTitle) {
                this.log(countTitle, ++this.$counter[$countTitle]);
            }
            else {
                this.log(++this.$counter[$countTitle]);
            }
        }
        debug(message, ...optionalParams) {
            this.$createLine(arguments, "debug");
        }
        dir(value) {
            this.$createLine(["%O", value], "dir");
        }
        dirxml(value) {
            this.$createLine(["%o", value], "dirxml");
        }
        error(message, ...optionalParams) {
            this.$createLine(arguments, "error");
        }
        group(groupTitle, ...optionalParams) {
            var expander = new expander_1.Expander({
                label: ""
            });
            expander.expandable = true;
            expander.element.setAttribute("type", "lines-expander");
            var line = this.$createLine(arguments.length > 0 ? arguments : ["console.group"], "group");
            while (line.firstChild) {
                expander.summary.appendChild(line.firstChild);
            }
            expander.summary.click();
            Console.$groups.push(Console.$output);
            domhelper_1.DOMHelper.replaceChild(expander.element, line);
            Console.$output = expander.element;
        }
        groupCollapsed(groupTitle, ...optionalParams) {
            var expander = new expander_1.Expander({
                label: ""
            });
            expander.expandable = true;
            expander.element.setAttribute("type", "lines-expander");
            var line = this.$createLine(arguments.length > 0 ? arguments : ["console.groupCollapsed"], "group");
            while (line.firstChild) {
                expander.summary.appendChild(line.firstChild);
            }
            Console.$groups.push(Console.$output);
            domhelper_1.DOMHelper.replaceChild(expander.element, line);
            Console.$output = expander.element;
        }
        groupEnd() {
            if (0 in Console.$groups) {
                Console.$output = Console.$groups.pop();
            }
        }
        info(message, ...optionalParams) {
            this.$createLine(arguments, "info");
        }
        log(message, ...optionalParams) {
            this.$createLine(arguments, "log");
        }
        time(timerName) {
            var $timerName = "$" + timerName;
            if ($timerName in this.$timer === false) {
                this.$timer[$timerName] = Date.now();
            }
        }
        timeEnd(timerName) {
            var $timerName = "$" + timerName;
            var $time = 0;
            if ($timerName in this.$timer) {
                $time = Date.now() - this.$timer[$timerName];
                delete this.$timer[$timerName];
            }
            this.log("%s: %fms", timerName || "default", $time);
        }
        warn(message, ...optionalParams) {
            this.$createLine(arguments, "warn");
        }
    }
    Console._idCounter = 0;
    Console.$frames = [];
    Console.element = (() => {
        var consoleElement = document.createElement("console");
        Console.$lines = document.createElement("lines");
        consoleElement.appendChild(Console.$lines);
        Console.$output = Console.$lines;
        var inputLine = document.createElement("input-line");
        var textarea = document.createElement("textarea");
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
                exec(editor) {
                    if (Console.$activeFrame === null) {
                        Console.$createLine(["Fatal Error: no frame is bound to the console"], "error", "top");
                        return;
                    }
                    var value = editor.getValue().trim();
                    if (value != "") {
                        try {
                            var line = document.createElement("line");
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
                        }
                        catch (e) {
                            Console.$createLine(["Uncaught:", e], "error", Console.$activeFrame.className);
                        }
                    }
                },
                readOnly: false
            }, {
                bindKey: "shift-enter",
                name: "insert enter",
                exec(editor) {
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
    Console.$activeFrame = null;
    Console.$groups = [];
    exports.Console = Console;
});
//# sourceMappingURL=console.js.map