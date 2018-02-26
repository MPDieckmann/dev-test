export declare const namespaceURI: namespaceURI;
export declare type namespaceURI = "https://mpdieckmann.github.io/dev-test";
export declare const htmlNamespaceURI: htmlNamespaceURI;
export declare type htmlNamespaceURI = "http://www.w3.org/1999/xhtml";
export declare namespace DOMHelper {
    function prependChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
    function insertBefore<T extends Node = Node>(newChild: T, refChild: Node): T;
    function replaceChild<T extends Node = Node>(newChild: T, oldChild: Node): T;
    function remove<T extends Node = Node>(oldChild: T): T;
    function removeChild<T extends Node = Node>(oldChild: T, parentNode: Node): T;
    function insertAfter<T extends Node = Node>(newChild: T, refChild: Node): T;
    function appendChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
}
