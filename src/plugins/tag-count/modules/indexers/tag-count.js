/*\
title: $:/plugins/benwebber/tag-count/modules/indexers/tag-count.js
type: application/javascript
module-type: indexer
\*/
(function(){
'use strict';

function TagCountIndexer(wiki) {
  this.wiki = wiki;
  this.index = {};
}

TagCountIndexer.prototype.init = function() {
  this.cacheTiddler = '$:/temp/plugins/benwebber/tag-count/cache';
  this.ignoreUpdatesForTitles = ['$:/StoryList', '$:/HistoryList'];
}

TagCountIndexer.prototype.rebuild = function() {
  this.index = this.getTagCounts();
}

TagCountIndexer.prototype.update = function(updateDescriptor) {
  const shouldUpdate = this.shouldUpdate(updateDescriptor);
  if (!shouldUpdate) {
    return;
  }
  const tagCounts = this.getTagCounts();
  const hasChanged = this.hasChanged(tagCounts);
  if (!hasChanged) {
    return;
  }
  this.index = tagCounts;
  this.wiki.addTiddler({title: this.cacheTiddler, text: JSON.stringify(this.index), type: 'application/json'});
};

TagCountIndexer.prototype.getTagCounts = function() {
  const indexer = this.wiki.getIndexer('TagIndexer').subIndexers[3]; // eachShadowPlusTiddlers
  indexer.lookup(); // Rebuild if necessary.
  return Object.fromEntries(Object.entries(indexer.index).map(([tag, tagged]) => [tag, tagged.titles.length]));
}

TagCountIndexer.prototype.hasChanged = function(tagCounts) {
  // TODO: This will not detect tags that exist in the index but no longer exist
  // in the wiki. Does this matter?
  for (const tag in tagCounts) {
    if (tagCounts[tag] !== this.index[tag]) {
      return true;
    }
  }
  return false;
}

TagCountIndexer.prototype.shouldUpdate = function(updateDescriptor) {
  const oldTiddler = updateDescriptor.old.tiddler;
  const newTiddler = updateDescriptor.new.tiddler;
  if (
    (oldTiddler && oldTiddler.fields.title === this.cacheTiddler)
    || (newTiddler && newTiddler.fields.title === this.cacheTiddler)
    || (newTiddler && this.ignoreUpdatesForTitles.includes(newTiddler.fields.title))
    || (newTiddler && newTiddler.fields['draft.of'])
  ) {
    return false;
  }
  return true;
}

exports.TagCountIndexer = TagCountIndexer;
})();
