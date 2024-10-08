import danish from './danish'
import english from './english'
import type { Language } from './lang'

export default [
  danish,
  english
].reduce((acc, l) => {
  acc[l.id] = l;
  return acc;
}, {} as Record<string, Language>)