/*\
title: $:/plugins/benwebber/motion/modules/startup/init.js
type: application/javascript
module-type: startup
\*/
(function() {
'use strict';

exports.platforms = ['browser'];
exports.after = ['startup'];
exports.synchronous = true;

const motion = {
  selectedStateTiddlerTitle: '$:/state/plugins/benwebber/motion/selected',

  init() {
    this.navigatorWidget = this.getNavigatorWidget($tw.rootWidget);
    $tw.hooks.addHook('th-closing-tiddler', this.handleClosingTiddler.bind(this));

    const shortcuts = {
      ShowHelp: () => {
        this.navigatorWidget.dispatchEvent({type: 'tm-modal', param: '$:/plugins/benwebber/motion/Help'});
        return false;
      },
      FocusSearch: () => {
        this.navigatorWidget.dispatchEvent({type: 'tm-focus-selector', param: '.tc-search input'});
        return false;
      },
      CreateNewTiddler: () => {
        this.navigatorWidget.dispatchEvent({type: 'tm-new-tiddler'});
        return false;
      },
      SaveWiki: () => {
        this.navigatorWidget.dispatchEvent({type: 'tm-save-wiki'});
        return false;
      },
      SelectNextTiddler: () => {
        let selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected') || '';
        const storyList = this.navigatorWidget.story.getStoryList();
        if (!storyList.length) {
          return;
        }
        let currentTiddlerIndex = storyList.indexOf(selectedTiddler);
        let nextTiddlerIndex;
        if (currentTiddlerIndex < 0) {
          nextTiddlerIndex = 0;
        } else {
          nextTiddlerIndex = Math.min(currentTiddlerIndex + 1, storyList.length - 1);
        }
        selectedTiddler = storyList[nextTiddlerIndex];
        $tw.wiki.addTiddler({title: '$:/state/plugins/benwebber/motion/selected', text: selectedTiddler});
        this.navigatorWidget.dispatchEvent({type: 'tm-navigate', navigateTo: selectedTiddler})
        return false;
      },
      SelectPreviousTiddler: () => {
        let selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected') || '';
        const storyList = this.navigatorWidget.story.getStoryList();
        if (!storyList.length) {
          return;
        }
        let currentTiddlerIndex = storyList.indexOf(selectedTiddler);
        let nextTiddlerIndex;
        if (currentTiddlerIndex < 0) {
          nextTiddlerIndex = 0;
        } else {
          nextTiddlerIndex = Math.max(currentTiddlerIndex - 1, 0);
        }
        selectedTiddler = storyList[nextTiddlerIndex];
        $tw.wiki.addTiddler({title: '$:/state/plugins/benwebber/motion/selected', text: selectedTiddler});
        this.navigatorWidget.dispatchEvent({type: 'tm-navigate', navigateTo: selectedTiddler})
        return false;
      },
      EditTiddler: () => {
        const selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected');
        if (!selectedTiddler) {
          return;
        }
        this.navigatorWidget.dispatchEvent({type: 'tm-edit-tiddler', param: selectedTiddler});
        return false;
      },
      CloseTiddler: () => {
        const selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected');
        if (!selectedTiddler) {
          return;
        }
        this.navigatorWidget.dispatchEvent({type: 'tm-close-tiddler', param: selectedTiddler});
        return false;
      },
      CloseAllTiddlers: () => {
        this.navigatorWidget.dispatchEvent({type: 'tm-close-all-tiddlers'});
        return false;
      },
      ToggleTiddler: () => {
        const selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected');
        if (!selectedTiddler) {
          return;
        }
        this.toggleTiddler(selectedTiddler);
        return false;
      },
      UnfoldTiddler: () => {
        const selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected');
        if (!selectedTiddler) {
          return;
        }
        this.unfoldTiddler(selectedTiddler);
        return false;
      },
      FoldTiddler: () => {
        const selectedTiddler = $tw.wiki.getTiddlerText('$:/state/plugins/benwebber/motion/selected');
        if (!selectedTiddler) {
          return;
        }
        this.foldTiddler(selectedTiddler);
        return false;
      },
      ToggleAllTiddlers: () => {
        const storyList = this.navigatorWidget.story.getStoryList();
        for (const title of storyList) {
          this.toggleTiddler(title);
        }
        return false;
      },
      FoldAllTiddlers: () => {
        const storyList = this.navigatorWidget.story.getStoryList();
        for (const title of storyList) {
          this.foldTiddler(title);
        }
        return false;
      },
      UnfoldAllTiddlers: () => {
        const storyList = this.navigatorWidget.story.getStoryList();
        for (const title of storyList) {
          this.unfoldTiddler(title);
        }
        return false;
      },
      Dismiss: () => {
        // Close help modal if it's open.
        // HACK: Close the modal by clicking the button to dispatch the internal
        // tm-close-tiddler message.
        const button = document.querySelector('.motion-help .tc-modal-footer button')
        if (button) {
          button.click();
        }
        // Deselect tiddler.
        $tw.wiki.deleteTiddler('$:/state/plugins/benwebber/motion/selected');
      },
    };
    for (const [name, handler] of Object.entries(shortcuts)) {
      const shortcut = this.getShortcut(name);
      Mousetrap.bind(shortcut, handler);
    };
  },

  getShortcut(name) {
    return $tw.wiki.getTiddlerText(`$:/plugins/benwebber/motion/config/Shortcuts/${name}/Key`);
  },

  handleClosingTiddler(event) {
    const selectedTiddler = $tw.wiki.getTiddlerText(this.selectedStateTiddlerTitle);
    if (event.param == selectedTiddler) {
      $tw.wiki.deleteTiddler(this.selectedStateTiddlerTitle);
    }
    return event;
  },

  toggleTiddler(title) {
    if ($tw.wiki.getTiddlerText(`$:/state/folded/${title}`) == 'hide') {
      this.unfoldTiddler(title);
    } else {
      this.foldTiddler(title);
    }
  },

  foldTiddler(title) {
    $tw.wiki.setText(`$:/state/folded/${title}`, 'text', null, 'hide');
  },

  unfoldTiddler(title) {
    $tw.wiki.deleteTiddler(`$:/state/folded/${title}`);
  },

  getNavigatorWidget(widget) {
    const child = widget.children[0];
    if (child.parseTreeNode.type == 'navigator') {
      return child;
    }
    return this.getNavigatorWidget(child);
  },

};

exports.startup = function() {
  $tw.modules.execute('$:/plugins/benwebber/motion/modules/mousetrap.min.js');
  motion.init();
  window._motion = motion;
};
})();
