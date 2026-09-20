/** Tiny className joiner: cn('a', condition && 'b') */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
