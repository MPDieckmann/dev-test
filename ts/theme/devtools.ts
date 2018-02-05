import "ace";
// import "css!../../ts/theme/devtools";
ace.define("theme/devtools", ["require", "exports", "module", "ace/lib/dom", "text!theme/devtools.css"], function (require, exports, module) {
  exports.isDark = false;
  exports.cssClass = "theme-devtools";
  exports.cssText = ".theme-devtools .ace_gutter {\
    background: #eee;\
    color: #444;\
    overflow: hidden;\
  }\
  \
  .theme-devtools .ace_print-margin {\
    width: 1px;\
    background: #eee;\
  }\
  \
  .theme-devtools {\
    background-color: #fff;\
    color: #000;\
  }\
  \
  .theme-devtools .ace_cursor {\
    color: #000;\
  }\
  \
  .theme-devtools .ace_invisible {\
    color: #aaa;\
  }\
  \
  .theme-devtools .ace_constant {\
    color: #00f;\
  }\
  \
  .theme-devtools .ace_fold {\
    background: #000;\
  }\
  \
  .theme-devtools .ace_function {\
    color: #486;\
  }\
  \
  .theme-devtools .ace_class {\
    color: #066;\
    font-weight: bold;\
  }\
  \
  .theme-devtools .ace_keyword.ace_operator {\
    color: #444;\
  }\
  \
  .theme-devtools .ace_comment {\
    color: #080;\
  }\
  \
  .theme-devtools .ace_comment.ace_tag {\
    color: #048;\
  }\
  \
  .theme-devtools .ace_numeric {\
    color: #008;\
  }\
  \
  .theme-devtools .ace_variable {\
    color: #066;\
  }\
  \
  .theme-devtools .ace_xml-pe {\
    color: #666;\
  }\
  \
  .theme-devtools .ace_name {\
    color: #008;\
  }\
  \
  .theme-devtools .ace_heading {\
    color: #00f;\
    font-weight: bold;\
  }\
  \
  .theme-devtools .ace_list {\
    color: #066;\
  }\
  \
  .theme-devtools .ace_marker-layer .ace_selection {\
    background: #bdf;\
  }\
  \
  .theme-devtools .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid #888;\
    background: #eee;\
  }\
  \
  .theme-devtools .ace_marker-layer .ace_active-line {\
    background: #0001;\
  }\
  \
  .theme-devtools .ace_gutter-active-line {\
    background: #0001;\
  }\
  \
  .theme-devtools .ace_marker-layer .ace_selected-word {\
    background: #eee;\
    border: 1px solid #888;\
  }\
  \
  .theme-devtools .ace_storage {\
    color: #00f;\
  }\
  \
  .theme-devtools .ace_keyword {\
    color: #808;\
  }\
  \
  .theme-devtools .ace_meta {\
    color: #808;\
  }\
  \
  .theme-devtools .ace_string {\
    color: #800;\
  }\
  \
  .theme-devtools .ace_entity.ace_other.ace_attribute-name {\
    color: #f00;\
  }\
  \
  .theme-devtools .ace_indent-guide {\
    border-right: 1px solid #ddd;\
    margin-right: -1px;\
  }";

  var dom = ace.require("ace/lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});