"use strict";
export var DOMHelper;
(function (DOMHelper) {
    function prependChild(newChild, parentNode) {
        if (parentNode.firstChild) {
            parentNode.insertBefore(newChild, parentNode.firstChild);
        }
        else {
            parentNode.appendChild(newChild);
        }
        return newChild;
    }
    DOMHelper.prependChild = prependChild;
    function insertBefore(newChild, refChild) {
        if (refChild.parentNode) {
            refChild.parentNode.insertBefore(newChild, refChild);
        }
        else {
            throw new DOMException("The second argument <refChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.insertBefore = insertBefore;
    function replaceChild(newChild, oldChild) {
        if (oldChild.parentNode) {
            oldChild.parentNode.replaceChild(newChild, oldChild);
        }
        else {
            throw new DOMException("The second argument <oldChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.replaceChild = replaceChild;
    function remove(oldChild) {
        if (oldChild.parentNode) {
            oldChild.parentNode.removeChild(oldChild);
        }
        return oldChild;
    }
    DOMHelper.remove = remove;
    function removeChild(oldChild, parentNode) {
        parentNode.removeChild(oldChild);
        return oldChild;
    }
    DOMHelper.removeChild = removeChild;
    function insertAfter(newChild, refChild) {
        if (refChild.parentNode) {
            if (refChild.nextSibling) {
                refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
            }
            else {
                refChild.parentNode.appendChild(newChild);
            }
        }
        else {
            throw new DOMException("The second argument <refChild> has no parentNode");
        }
        return newChild;
    }
    DOMHelper.insertAfter = insertAfter;
    function appendChild(newChild, parentNode) {
        parentNode.appendChild(newChild);
        return newChild;
    }
    DOMHelper.appendChild = appendChild;
})(DOMHelper = DOMHelper || (DOMHelper = {}));
//# sourceMappingURL=domhelper.js.map