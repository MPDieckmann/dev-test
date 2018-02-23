export declare namespace DOMHelper {
    function prependChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
    function insertBefore<T extends Node = Node>(newChild: T, refChild: Node): T;
    function replaceChild<T extends Node = Node>(newChild: T, oldChild: Node): T;
    function remove<T extends Node = Node>(oldChild: T): T;
    function removeChild<T extends Node = Node>(oldChild: T, parentNode: Node): T;
    function insertAfter<T extends Node = Node>(newChild: T, refChild: Node): T;
    function appendChild<T extends Node = Node>(newChild: T, parentNode: Node): T;
}
