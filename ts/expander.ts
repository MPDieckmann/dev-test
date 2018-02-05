import "css!../css/expander";

export class ExtendableExpander<T extends ExtendableExpander<T>> {
  public element = document.createElement("expander");
  public summary = document.createElement("label");
  protected constructor(options: ExtendableExpander.Options<T> = {}) {
    this.element.appendChild(this.summary);
    this.summary.addEventListener("click", event => {
      if (this.$expandable && !this.element.hasAttribute("open")) {
        this.element.setAttribute("open", "");
        typeof this.$onexpand == "function" && this.$onexpand.call(this, event);
        if (this.$wasExpanded == false) {
          this.$wasExpanded = true;
        }
      } else {
        this.element.removeAttribute("open");
        typeof this.$oncollapse == "function" && this.$oncollapse.call(this, event);
      }
      event.preventDefault();
    });
    this.$onexpand = options.onexpand || null;
    this.$oncollapse = options.oncollapse || null;
  }
  protected get $expandable(): boolean {
    return this.element.hasAttribute("expandable");
  }
  protected set $expandable(value: boolean) {
    if (value) {
      this.element.setAttribute("expandable", "");
    } else {
      this.element.removeAttribute("expandable");
    }
  }
  protected $wasExpanded: boolean = false;
  protected $onexpand: ExtendableExpander.EventListener<T> | null;
  protected $oncollapse: ExtendableExpander.EventListener<T> | null;
}
declare namespace ExtendableExpander {
  interface Options<T extends ExtendableExpander<T>> {
    onexpand?: EventListener<T>;
    oncollapse?: EventListener<T>;
  }
  type EventListener<T extends ExtendableExpander<T>> = (this: T, event: Event) => void;
}

export class Expander<T extends Expander<T>> extends ExtendableExpander<T> {
  constructor(options: Expander.Options<T>) {
    super(options);
    this.label = options.label;
  }
  public get label(): string {
    return this.summary.innerHTML;
  }
  public set label(value: string) {
    this.summary.innerHTML = value;
  }
  public get expandable(): boolean {
    return this.$expandable;
  }
  public set expandable(value: boolean) {
    this.$expandable = value;
  }
  public get wasExpanded(): boolean {
    return this.$wasExpanded;
  }
  public set wasExpanded(value: boolean) {
    this.$wasExpanded = value;
  }
  public get onexpand(): ExtendableExpander.EventListener<T> | null {
    return this.$onexpand;
  }
  public set onexpand(value: ExtendableExpander.EventListener<T> | null) {
    this.$onexpand = value;
  }
  public get oncollapse(): ExtendableExpander.EventListener<T> | null {
    return this.$oncollapse;
  }
  public set oncollapse(v: ExtendableExpander.EventListener<T> | null) {
    this.$oncollapse = v;
  }
}
declare namespace Expander {
  interface Options<T extends Expander<T>> extends ExtendableExpander.Options<T> {
    label: string;
  }
}