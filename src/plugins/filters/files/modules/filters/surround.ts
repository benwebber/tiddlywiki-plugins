import type { Operator, Source } from '.';

export function surround(source: Source, operator: Operator, _options: any): string[] {
  const left = operator.operands[0] || '';
  const right = operator.operands[1] === undefined ? left : operator.operands[1];
  const results: string[] = [];
  source((_tiddler: any, title: string) => {
    results.push(`${left}${title}${right}`);
  });
  return results;
}
