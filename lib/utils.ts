export function cn(...inputs: any[]) {
  return inputs
    .filter(Boolean)
    .map(x => {
      if (typeof x === 'object' && x !== null) {
        return Object.entries(x)
          .filter(([_, val]) => Boolean(val))
          .map(([key]) => key)
          .join(' ');
      }
      return String(x);
    })
    .join(' ');
}
