import type { Operator, Source } from '.';

export function normalize(source: Source, operator: Operator, _options: any): string[] {
  const suffix = operator.suffix ? operator.suffix.toUpperCase() : '';
  let form: string;
  switch (suffix) {
    case 'NFD':
      form = 'NFD';
      break;
    case 'NFKC':
      form = 'NFKC';
      break;
    case 'NFKD':
      form = 'NFKD';
      break;
    default:
      form = 'NFC';
  }
  const results: string[] = [];
  source((_tiddler: any, title: string) => {
    results.push(title.normalize(form));
  });
  return results;
}
