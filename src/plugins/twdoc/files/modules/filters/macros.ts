function macros(source: any, _operator: any, _options: any): string[] {
  const output: any[] = [];
  const visit = (title: string, node: any) => {
    if (node.isMacroDefinition) {
      output.push({title, type: 'text/vnd.tiddlywiki', name: node.attributes.name.value, params: node.params});
      for (const child of node.children) {
        visit(title, child);
      }
    }
  };
  source((tiddler: any, title: string) => {
    if ($tw.modules.types.macro.hasOwnProperty(title)) {
      const exports = $tw.modules.types.macro[title].exports;
      output.push({title, type: 'application/javascript', name: exports.name, params: exports.params});
    } else {
      const tiddler_ = tiddler || $tw.wiki.getTiddler(title);
      if (tiddler_ && (tiddler_.fields.type === 'text/vnd.tiddlywiki' || 'text/vnd.tiddlywiki')) {
        const parsed = $tw.wiki.parseTiddler(title);
        for (const node of parsed.tree) {
          visit(title, node);
        }
      }
    }
  });
  return output.map(m => JSON.stringify(m));
}

export = {'twdoc.macros': macros};
