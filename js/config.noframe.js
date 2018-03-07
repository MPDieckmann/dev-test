requirejs.config({
    baseUrl: "https://mpdieckmann.github.io/dev-test/js/",
    // baseUrl: "./js/",
    context: "mpdieckmann.github.io/dev-test",
    xhtml: true,
    paths: {
        "ace": "https://ajaxorg.github.io/ace-builds/src-noconflict/ace"
    }
})(["require", "ace"], function (r) {
  r(["ace/mode-javascript","./setup.noframe"]);
});
//# sourceMappingURL=config.noframe.js.map
