(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "css!../css/expander"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("css!../css/expander");
    class ExtendableExpander {
        constructor(options = {}) {
            this.element = document.createElement("expander");
            this.summary = document.createElement("label");
            this.$wasExpanded = false;
            this.element.appendChild(this.summary);
            this.summary.addEventListener("click", event => {
                if (this.$expandable && !this.element.hasAttribute("open")) {
                    this.element.setAttribute("open", "");
                    typeof this.$onexpand == "function" && this.$onexpand.call(this, event);
                    if (this.$wasExpanded == false) {
                        this.$wasExpanded = true;
                    }
                }
                else {
                    this.element.removeAttribute("open");
                    typeof this.$oncollapse == "function" && this.$oncollapse.call(this, event);
                }
                event.preventDefault();
            });
            this.$onexpand = options.onexpand || null;
            this.$oncollapse = options.oncollapse || null;
        }
        get $expandable() {
            return this.element.hasAttribute("expandable");
        }
        set $expandable(value) {
            if (value) {
                this.element.setAttribute("expandable", "");
            }
            else {
                this.element.removeAttribute("expandable");
            }
        }
    }
    exports.ExtendableExpander = ExtendableExpander;
    class Expander extends ExtendableExpander {
        constructor(options) {
            super(options);
            this.label = options.label;
        }
        get label() {
            return this.summary.innerHTML;
        }
        set label(value) {
            this.summary.innerHTML = value;
        }
        get expandable() {
            return this.$expandable;
        }
        set expandable(value) {
            this.$expandable = value;
        }
        get wasExpanded() {
            return this.$wasExpanded;
        }
        set wasExpanded(value) {
            this.$wasExpanded = value;
        }
        get onexpand() {
            return this.$onexpand;
        }
        set onexpand(value) {
            this.$onexpand = value;
        }
        get oncollapse() {
            return this.$oncollapse;
        }
        set oncollapse(v) {
            this.$oncollapse = v;
        }
    }
    exports.Expander = Expander;
});
//# sourceMappingURL=expander.js.map