/*\
title: filters.spec.js
type: application/javascript
tags: [[$:/tags/test-spec]]
\*/
(function() {
  let wiki;

  beforeAll(() => {
    wiki = new $tw.Wiki();
  });

  describe('The surround filter operator', () => {
    it('should surround titles with a prefix and suffix', () => {
      expect(wiki.filterTiddlers('a b c +[surround[]]')).toEqual(['a', 'b', 'c']);
      expect(wiki.filterTiddlers('a b c +[surround[],[]]')).toEqual(['a', 'b', 'c']);
      expect(wiki.filterTiddlers('a b c +[surround["]]')).toEqual(['"a"', '"b"', '"c"']);
      expect(wiki.filterTiddlers('a b c +[surround[<],[]]')).toEqual(['<a', '<b', '<c']);
      expect(wiki.filterTiddlers('a b c +[surround[<],[>]]')).toEqual(['<a>', '<b>', '<c>']);
    });
  });
})();
