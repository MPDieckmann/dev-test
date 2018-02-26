define(["require", "exports", "./domhelper", "css!../css/expander"], function (require, exports, domhelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExtendableExpander {
        constructor(options = {}) {
            this.element = document.createElementNS(domhelper_1.namespaceURI, "expander");
            this.summary = document.createElementNS(domhelper_1.namespaceURI, "label");
            this.$wasExpanded = false;
            this.element.appendChild(this.summary);
            this.summary.addEventListener("click", event => {
                this.$toggle();
                event.preventDefault();
            });
            this.$onexpand = options.onexpand || null;
            this.$oncollapse = options.oncollapse || null;
        }
        get expanded() {
            return this.$expandable && !this.element.hasAttribute("open");
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
        $expand() {
            if (this.$expandable) {
                this.element.setAttribute("open", "");
                typeof this.$onexpand == "function" && this.$onexpand.call(this);
                if (this.$wasExpanded == false) {
                    this.$wasExpanded = true;
                }
            }
        }
        $collapse() {
            this.element.removeAttribute("open");
            typeof this.$oncollapse == "function" && this.$oncollapse.call(this);
        }
        $toggle(force = null) {
            if (force === false) {
                this.$collapse();
            }
            else if (this.expanded || force === true) {
                this.$expand();
            }
            else {
                this.$collapse();
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
        expand() {
            this.$expand();
        }
        collapse() {
            this.$collapse();
        }
        toggle(force = null) {
            this.$toggle(force);
        }
    }
    exports.Expander = Expander;
});
//# sourceMappingURL=expander.js.map