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

  describe('The normalize filter operator', () => {
    let str = '\u03D3\u03D4\u1E9B'; // https://www.unicode.org/faq/normalization.html#6

    it('should default to NFC form', () => {
      let expected = str.normalize('NFC');
      expect(wiki.filterTiddlers(`${str} +[normalize[]]`)).toEqual([expected]);
      expect(wiki.filterTiddlers(`${str} +[normalize:[]]`)).toEqual([expected]);
      expect(wiki.filterTiddlers(`${str} +[normalize:_[]]`)).toEqual([expected]);
    });

    for (const form of ['NFC', 'NFD', 'NFKC', 'NFKD']) {
      it(`should normalize titles in ${form} form`, () => {
        expected = str.normalize(form);
        expect(wiki.filterTiddlers(`${str} +[normalize:${form}[]]`)).toEqual([expected]);
        expect(wiki.filterTiddlers(`${str} +[normalize:${form.toLowerCase()}[]]`)).toEqual([expected]);
      });
    }
  });
})();
