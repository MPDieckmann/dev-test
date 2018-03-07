# dev-test
Rich JS-Console for every page that allows loading scripts from <https://mpdieckmann.github.io/>.

Click here to see a demo with a blank page [demo.html](https://mpdieckmann.github.io/dev-test/demo.html).

Simply save the <a href="javascript:(function(){if('function'==typeof requirejs&&'function'==typeof requirejs.config)requirejs.config({context:'mpdieckmann.github.io/dev-test',xhtml:!0,baseUrl:'https://mpdieckmann.github.io/dev-test/js/'})(['config.noframe.js']);else{self.requirejs={context:'mpdieckmann.github.io/dev-test',xhtml:!0,baseUrl:'https://mpdieckmann.github.io/dev-test/js/'};var e=document.createElementNS('http://www.w3.org/1999/xhtml','script');e.src='https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js',e.setAttribute('data-main','https://mpdieckmann.github.io/dev-test/js/config.noframe.js'),e.setAttribute('data-requirecontext','mpdieckmann.github.io/dev-test'),e.type='text/javascript',document.head?document.head.appendChild(e):document.firstElementChild&&document.firstElementChild.appendChild(e)}})();">this link</a> into your bookmarks and open the open on the page you wish to inspect.

The link is the uglified version of the following script:

```javascript
javascript:(function () {
  if (typeof requirejs == "function" && typeof requirejs.config == "function") {
    requirejs.config({
      context: "mpdieckmann.github.io/dev-test",
      xhtml: true,
      baseUrl: "https://mpdieckmann.github.io/dev-test/js/"
    })(["config.noframe.js"]);
  } else {
    self.requirejs = {
      context: "mpdieckmann.github.io/dev-test",
      xhtml: true,
      baseUrl: "https://mpdieckmann.github.io/dev-test/js/"
    };
    var script = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js";
    script.setAttribute("data-main", "https://mpdieckmann.github.io/dev-test/js/config.noframe.js");
    script.setAttribute("data-requirecontext", "mpdieckmann.github.io/dev-test");
    script.type = "text/javascript";
    if (document.head) {
      document.head.appendChild(script);
    } else if (document.firstElementChild) {
      document.firstElementChild.appendChild(script);
    }
  }
})();
```

```javascript
javascript:(function(){if('function'==typeof requirejs&&'function'==typeof requirejs.config)requirejs.config({context:'mpdieckmann.github.io/dev-test',xhtml:!0,baseUrl:'https://mpdieckmann.github.io/dev-test/js/'})(['config.noframe.js']);else{self.requirejs={context:'mpdieckmann.github.io/dev-test',xhtml:!0,baseUrl:'https://mpdieckmann.github.io/dev-test/js/'};var e=document.createElementNS('http://www.w3.org/1999/xhtml','script');e.src='https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js',e.setAttribute('data-main','https://mpdieckmann.github.io/dev-test/js/config.noframe.js'),e.setAttribute('data-requirecontext','mpdieckmann.github.io/dev-test'),e.type='text/javascript',document.head?document.head.appendChild(e):document.firstElementChild&&document.firstElementChild.appendChild(e)}})();
```
