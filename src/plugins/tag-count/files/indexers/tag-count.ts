type UpdateState = {
  tiddler: any;
  shadow: boolean;
  exists: boolean;
}

type UpdateDescriptor = {
  old: UpdateState;
  new: UpdateState;
}

type TagCounts = {
  [tag: string]: number;
}

type TagIndexerIndex = {
  [tag: string]: {
    isSorted: boolean;
    titles: string[];
  }
}

class TagCountIndexer {
  wiki: any;
  private index: TagCounts = {};
  private cacheTiddler = '$:/temp/plugins/benwebber/tag-count/cache';
  private ignoreUpdatesForTitles = ['$:/StoryList', '$:/HistoryList'];

  constructor(wiki: any) {
    this.wiki = wiki;
  }

  init() {}

  rebuild() {
    this.index = this.getTagCounts();
  }

  update(updateDescriptor: UpdateDescriptor) {
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
  }

  getTagCounts() {
    const indexer = this.wiki.getIndexer('TagIndexer').subIndexers[3]; // eachShadowPlusTiddlers
    indexer.lookup(); // Rebuild if necessary.
    return Object.fromEntries(Object.entries(indexer.index as TagIndexerIndex).map(([tag, tagged]) => [tag, tagged.titles.length]));
  }

  hasChanged(tagCounts: TagCounts) {
    // TODO: This will not detect tags that exist in the index but no longer exist
    // in the wiki. Does this matter?
    for (const tag in tagCounts) {
      if (tagCounts[tag] !== this.index[tag]) {
        return true;
      }
    }
    return false;
  }

  shouldUpdate(updateDescriptor: UpdateDescriptor) {
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
}

export { TagCountIndexer };
