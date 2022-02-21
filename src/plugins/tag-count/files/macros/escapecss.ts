export const name = 'tag-count.escapecss';
export const params = [{name: 'title'}];
export function run(title: string) {
  return CSS.escape(title);
}
