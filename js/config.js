requirejs.config({
    baseUrl: "https://mpdieckmann.github.io/dev-test/js/",
    // baseUrl: "./js/",
    context: "mpdieckmann.github.io/dev-test",
    xhtml: true,
    paths: {
        "ace": "https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.1/"
    }
})(["require", "ace/ace"], function (r) {
  r(["./setup"]);
});
//# sourceMappingURL=config.js.map
