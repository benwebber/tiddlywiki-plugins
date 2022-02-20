/*\
title: $:/plugins/benwebber/tag-count/modules/macros/escapecss.js
type: application/javascript
module-type: macro
\*/
(function(){
'use strict';
exports.name = 'tag-count.escapecss';
exports.params = [{name: 'title'}];
exports.run = function(title) {
  return CSS.escape(title);
};
})();
