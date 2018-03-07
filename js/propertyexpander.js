define(["require", "exports", "./domhelper", "./expander", "css!../css/propertyexpander"], function (require, exports, domhelper_1, expander_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PropertyExpander extends expander_1.ExtendableExpander {
        constructor(options) {
            super();
            this.property = options.property;
            try {
                switch (this.toType()) {
                    case "boolean":
                        this.$boolean(this.property);
                        break;
                    case "function":
                        this.$function(this.property);
                        break;
                    case "iterable":
                        this.$iterable(this.property);
                        break;
                    case "null":
                        this.$null(this.property);
                        break;
                    case "number":
                        this.$number(this.property);
                        break;
                    case "object":
                        this.$object(this.property);
                        break;
                    case "regexp":
                        this.$regexp(this.property);
                        break;
                    case "string":
                        this.$string(this.property);
                        break;
                    case "symbol":
                        this.$symbol(this.property);
                        break;
                    default:
                        throw "Cannot handle typeof property: " + typeof this.property;
                }
            }
            catch (e) {
                this.$object(this.property);
            }
            this.summary.innerHTML = '<value type="' + (this.element.getAttribute("type") || "").replace("-property", "") + '">' + this.summary.innerHTML + '</value>';
            // this.summary.addEventListener("dblclick", event => {
            //   var input = document.createElementNS(namespaceURI, "input");
            //   switch (this.toType()) {
            //     case "boolean":
            //     case "function":
            //     case "number":
            //     case "regexp":
            //     case "symbol":
            //       input.value = this.property.toString();
            //       break;
            //     case "string":
            //       input.value = '"' + this.property + '"';
            //       break;
            //     case "iterable":
            //       input.value = JSON.stringify(this.property);
            //       break;
            //     case "null":
            //       input.value = String(this.property);
            //       break;
            //   }
            //   input.addEventListener("keydown", event=>{
            //     if (event.keyCode == 13) {
            //       DOMHelper.replaceChild(this.summary, input);
            //     }
            //   });
            //   DOMHelper.replaceChild(input, this.summary);
            // });
        }
        $createValue(prop) {
            var expander = new PropertyExpander({
                property: prop.value
            });
            expander.summary.innerHTML = '<key type="' + prop.type + '">' + prop.key.toString() + '</key>: ' + expander.summary.innerHTML;
            if (prop.enumerable == false) {
                expander.element.setAttribute("enumerable", "false");
            }
            if (prop.writable) {
                expander.element.setAttribute("editable", "");
            }
            this.element.appendChild(expander.element);
        }
        $createGet(prop) {
            var placeholder = document.createElementNS(domhelper_1.namespaceURI, this.element.tagName);
            placeholder.setAttribute("type", "property-placeholder");
            placeholder.innerHTML = '<label><key type="' + prop.type + '">' + prop.key.toString() + '</key>: <value type="placeholder">(...)</value></label>';
            placeholder.addEventListener("click", () => {
                var expander;
                try {
                    expander = new PropertyExpander({
                        property: prop.get.call(this.property)
                    });
                }
                catch (e) {
                    expander = new PropertyExpander({
                        property: e
                    });
                    expander.element.setAttribute("type", expander.element.getAttribute("type") + " error");
                }
                expander.summary.innerHTML = '<key type="' + prop.type + '">' + prop.key.toString() + '</key>: ' + expander.summary.innerHTML;
                if (prop.enumerable == false) {
                    expander.element.setAttribute("enumerable", "false");
                }
                if ("set" in prop && typeof prop.set == "function") {
                    expander.element.setAttribute("editable", "");
                }
                domhelper_1.DOMHelper.replaceChild(expander.element, placeholder);
            });
            if (prop.enumerable == false) {
                placeholder.setAttribute("enumerable", "false");
            }
            this.element.appendChild(placeholder);
        }
        $createGetter(prop) {
            var expander = new PropertyExpander({
                property: prop.get
            });
            expander.summary.innerHTML = '<key type="get-' + prop.type + '">get ' + prop.key.toString() + '</key>: ' + expander.summary.innerHTML;
            if (prop.enumerable == false) {
                expander.element.setAttribute("enumerable", "false");
            }
            if (prop.configurable) {
                expander.element.setAttribute("editable", "");
            }
            this.element.appendChild(expander.element);
        }
        $createSetter(prop) {
            var expander = new PropertyExpander({
                property: prop.set
            });
            expander.summary.innerHTML = '<key type="set-' + prop.type + '">set ' + prop.key.toString() + '</key>: ' + expander.summary.innerHTML;
            if (prop.enumerable == false) {
                expander.element.setAttribute("enumerable", "false");
            }
            if (prop.configurable) {
                expander.element.setAttribute("editable", "");
            }
            this.element.appendChild(expander.element);
        }
        $propertySorter(a, b) {
            if (a == b) {
                return 0;
            }
            if (typeof a == "symbol") {
                if (typeof b != "symbol") {
                    return 1;
                }
                a = a.toString();
            }
            if (typeof b == "symbol") {
                if (typeof a != "symbol") {
                    return -1;
                }
                b = b.toString();
            }
            var index = 0;
            var length = Math.min(a.length, b.length);
            for (index; index < length; index++) {
                if (a[index] == "_" && a[index] != b[index]) {
                    return 1;
                }
                if (b[index] == "_" && a[index] != b[index]) {
                    return -1;
                }
                if (a[index] == "$" && a[index] != b[index]) {
                    return 1;
                }
                if (b[index] == "$" && a[index] != b[index]) {
                    return -1;
                }
                if (a.charCodeAt(index) > b.charCodeAt(index)) {
                    return 1;
                }
                else if (a.charCodeAt(index) < b.charCodeAt(index)) {
                    return -1;
                }
            }
            if (a.length > b.length) {
                return 1;
            }
            else if (a.length < b.length) {
                return -1;
            }
            return 0;
        }
        $properties(property) {
            this.$expandable = true;
            this.$onexpand = () => {
                if (!this.$wasExpanded) {
                    var values = Object.create(null);
                    var prototypes = [];
                    var tmp = property;
                    do {
                        prototypes.unshift(tmp);
                    } while (tmp = Object.getPrototypeOf(tmp));
                    prototypes.forEach(tmp => {
                        Object.getOwnPropertyNames(tmp).forEach(name => {
                            var desc = Object.getOwnPropertyDescriptor(tmp, name);
                            if ("get" in desc || tmp === property) {
                                values[name] = Object.assign(desc, {
                                    key: name,
                                    type: isNaN(parseInt(name)) ? "string" : "number",
                                    owner: tmp
                                });
                            }
                        });
                        Object.getOwnPropertySymbols(tmp).forEach(name => {
                            var desc = Object.getOwnPropertyDescriptor(tmp, name);
                            if ("get" in desc || tmp === property) {
                                values[name] = Object.assign(desc, {
                                    key: name,
                                    type: "symbol",
                                    owner: tmp
                                });
                            }
                        });
                    });
                    [].concat(Object.getOwnPropertyNames(values), Object.getOwnPropertySymbols(values)).sort(this.$propertySorter).forEach((key) => {
                        var prop = values[key];
                        if ("value" in prop) {
                            this.$createValue(prop);
                        }
                        if ("get" in prop && typeof prop.get == "function") {
                            this.$createGet(prop);
                        }
                        if (prop.owner === this.property) {
                            if ("get" in prop && typeof prop.get == "function") {
                                this.$createGetter(prop);
                            }
                            if ("set" in prop && typeof prop.set == "function") {
                                this.$createSetter(prop);
                            }
                        }
                    });
                }
            };
        }
        $boolean(property) {
            this.element.setAttribute("type", "boolean-property");
            this.summary.textContent = property.toString();
        }
        $function(property) {
            this.element.setAttribute("type", "function-property");
            var string = property.toString();
            var tmp = /^(?:function|class)[^\{]*{/.exec(string);
            if (tmp) {
                var result = tmp[0].replace(/\s+/g, " ");
                this.summary.textContent = result + " [javascript] }";
            }
            else {
                this.summary.textContent = string;
            }
            this.$properties(property);
        }
        $iterable(property) {
            this.element.setAttribute("type", "iterable-property");
            this.summary.textContent = property.constructor.name + "[" + property.length + "]";
            this.$properties(property);
        }
        $null(property) {
            this.element.setAttribute("type", "null-property");
            this.summary.textContent = String(property);
        }
        $number(property) {
            this.element.setAttribute("type", "number-property");
            this.summary.textContent = property.toString();
        }
        $object(property) {
            this.element.setAttribute("type", "object-property");
            var summaryText;
            try {
                summaryText = property.toString();
                summaryText = summaryText.replace(/^\[object (.*)\]$/, "$1");
            }
            catch (e) {
                summaryText = Object.prototype.toString.call(property).replace(/^\[object (.*)\]$/, "$1");
            }
            this.summary.textContent = summaryText;
            this.$properties(property);
        }
        $regexp(property) {
            this.element.setAttribute("type", "regexp-property");
            this.summary.textContent = property.toString();
            this.$properties(property);
        }
        $string(property) {
            this.element.setAttribute("type", "string-property");
            this.summary.textContent = '"' + property + '"';
        }
        $symbol(property) {
            this.element.setAttribute("type", "symbol-property");
            this.summary.textContent = property.toString();
        }
        toType() {
            switch (typeof this.property) {
                case "boolean":
                    return "boolean";
                case "function":
                    return "function";
                case "number":
                    return "number";
                case "object":
                    try {
                        if (this.property === null) {
                            return "null";
                        }
                        else if (this.property instanceof RegExp) {
                            return "regexp";
                        }
                        else if ("length" in this.property && typeof this.property.length == "number") {
                            return "iterable";
                        }
                    }
                    catch (e) { }
                    return "object";
                case "string":
                    return "string";
                case "symbol":
                    return "symbol";
                case "undefined":
                    return "null";
            }
        }
    }
    exports.PropertyExpander = PropertyExpander;
});
//# sourceMappingURL=propertyexpander.js.map