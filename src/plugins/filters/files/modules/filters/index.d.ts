export type SourceIterator = (tiddler: any, title: string) => void;
export type Source = (iterator: SourceIterator) => void;
export type Operator = {
  operands: string[];
};
