import { CHARS } from '../constants';

export default function uid(length) {
  return Array.from(Array(length)).reduce(
    res => res + CHARS[Math.floor(Math.random() * CHARS.length)],
    ''
  );
}
