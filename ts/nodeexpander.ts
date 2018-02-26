import { ExtendableExpander } from "./expander";
import "css!../css/nodeexpander";
import { namespaceURI } from "./domhelper";

export class NodeExpander<N extends Node, T extends NodeExpander<N, T>> extends ExtendableExpander<T> {
  constructor(options: NodeExpander.Options<N>) {
    super();
    this.node = options.node;
    switch (this.node.nodeType) {
      case this.node.ELEMENT_NODE:
        this.$elementNode();
        break;
      case this.node.ATTRIBUTE_NODE:
        this.$attributeNode();
        break;
      case this.node.TEXT_NODE:
        this.$textNode();
        break;
      case this.node.CDATA_SECTION_NODE:
        this.$cdataSectionNode();
        break;
      case this.node.ENTITY_REFERENCE_NODE:
        this.$entityReferenceNode();
        break;
      case this.node.ENTITY_NODE:
        this.$entityNode();
        break;
      case this.node.PROCESSING_INSTRUCTION_NODE:
        this.$processingInstructionNode();
        break;
      case this.node.COMMENT_NODE:
        this.$commentNode();
        break;
      case this.node.DOCUMENT_NODE:
        this.$documentNode();
        break;
      case this.node.DOCUMENT_TYPE_NODE:
        this.$documentTypeNode();
        break;
      case this.node.DOCUMENT_FRAGMENT_NODE:
        this.$documentFragmentNode();
        break;
      case this.node.NOTATION_NODE:
        this.$notationNode();
        break;
      default:
        throw "Cannot handle nodeType: " + this.node.nodeType;
    }
  }
  public node: N;
  protected $elementNode() {
    this.element.setAttribute("type", "element-node");
    var summaryStart = "&lt;" + this.node.localName;
    var attrIndex = 0;
    var attrLength = this.node.attributes.length;
    var attribute: Attr;
    for (attrIndex; attrIndex < attrLength; attrIndex++) {
      attribute = this.node.attributes[attrIndex];
      summaryStart += " <attr-name>" + attribute.localName + "</attr-name>";
      if (attribute.nodeValue) {
        summaryStart += '="<attr-value>' + attribute.nodeValue + '</attr-value>"';
      }
    }
    var summaryText = summaryStart + " />";
    if (this.$expandable = this.node.hasChildNodes()) {
      summaryStart += "&gt;";
      var summaryEnd = "&lt;/" + this.node.localName + "&gt;";
      summaryText = summaryStart + "\u2026" + summaryEnd;

      var lastChild = document.createElementNS(namespaceURI, "label");
      lastChild.innerHTML = summaryEnd;
      this.element.appendChild(lastChild);

      this.$oncollapse = () => {
        this.summary.innerHTML = summaryText;
      }
      this.$onexpand = () => {
        this.summary.innerHTML = summaryStart;
        if (!this.$wasExpanded) {
          var chldIndex = 0;
          var chldLength = this.node.childNodes.length;
          for (chldIndex; chldIndex < chldLength; chldIndex++) {
            if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
              continue;
            }
            this.element.insertBefore(new NodeExpander({
              node: this.node.childNodes[chldIndex]
            }).element, lastChild);
          }
        }
      }
    }
    this.summary.innerHTML = summaryText;
  }
  protected $attributeNode() {
    this.element.setAttribute("type", "attribute-node");
    var attrText = " <attr-name>" + this.node.localName + "</attr-name>";
    if (this.node.nodeValue) {
      attrText += '="<attr-value>' + this.node.nodeValue + '</attr-value>"';
    }
    this.summary.innerHTML = attrText;
  }
  protected $textNode() {
    this.element.setAttribute("type", "text-node");
    if (this.node.nodeValue) {
      var detailsText = document.createElementNS(namespaceURI, "text");
      detailsText.textContent = this.node.nodeValue;
      if (/\n/.test(this.node.nodeValue)) {
        this.summary.textContent = this.node.nodeName;
        this.element.appendChild(detailsText);
        this.$expandable = true;
      } else {
        this.summary.appendChild(detailsText);
      }
    } else {
      this.summary.textContent = this.node.nodeName;
    }
  }
  protected $cdataSectionNode() {
    this.element.setAttribute("type", "cdata-node");
    var detailsText = document.createElementNS(namespaceURI, "cdata");
    detailsText.textContent = "<![CDATA[" + this.node.nodeValue + "]]>";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.element.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $entityReferenceNode() {
    console.warn("ENTITY_REFERENCE_NODE is obsolete");
  }
  protected $entityNode() {
    console.warn("ENTITY_NODE is obsolete");
  }
  protected $processingInstructionNode() {
    this.element.setAttribute("type", "processing-instruction-node");
    var detailsText = document.createElementNS(namespaceURI, "text");
    detailsText.textContent = "<?" + this.node.nodeName + " " + this.node.nodeValue + "?>";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.element.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $commentNode() {
    this.element.setAttribute("type", "comment-node");
    var detailsText = document.createElementNS(namespaceURI, "comment");
    detailsText.textContent = "<!--" + this.node.nodeValue + "-->";
    if (/\n/.test(this.node.nodeValue || "")) {
      this.summary.textContent = this.node.nodeName;
      this.element.appendChild(detailsText);
      this.$expandable = true;
    } else {
      this.summary.appendChild(detailsText);
    }
  }
  protected $documentNode() {
    this.element.setAttribute("type", "document-node");
    this.summary.textContent = this.node.nodeName;
    if (this.$expandable = this.node.hasChildNodes()) {
      this.$onexpand = () => {
        if (!this.$wasExpanded) {
          var chldIndex = 0;
          var chldLength = this.node.childNodes.length;
          for (chldIndex; chldIndex < chldLength; chldIndex++) {
            if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
              continue;
            }
            this.element.appendChild(new NodeExpander({
              node: this.node.childNodes[chldIndex]
            }).element);
          }
        }
      }
    }
  }
  protected $documentTypeNode() {
    this.element.setAttribute("type", "document-type-node");
    var summaryText = document.createElementNS(namespaceURI, "document-type");
    summaryText.textContent = "<!DOCTYPE " + this.node.nodeName + ">";
    this.summary.appendChild(summaryText);
  }
  protected $documentFragmentNode() {
    this.element.setAttribute("type", "document-fragment-node");
    this.summary.textContent = this.node.nodeName;
    if (this.$expandable = this.node.hasChildNodes()) {
      this.$onexpand = () => {
        if (!this.$wasExpanded) {
          var chldIndex = 0;
          var chldLength = this.node.childNodes.length;
          for (chldIndex; chldIndex < chldLength; chldIndex++) {
            if (this.node.childNodes[chldIndex].nodeType == this.node.TEXT_NODE && /^\s*$/.test(this.node.childNodes[chldIndex].nodeValue || "")) {
              continue;
            }
            this.element.appendChild(new NodeExpander({
              node: this.node.childNodes[chldIndex]
            }).element);
          }
        }
      }
    }
  }
  protected $notationNode() {
    console.warn("NOTATION_NODE is obsolete");
  }
}

declare namespace NodeExpander {
  interface Options<N extends Node> {
    node: N
  }
}