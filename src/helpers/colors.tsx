export const invertHex = (hex: string) => {
  const number = hex.substring(1, 7);
  const inverted = (Number(`0x1${number}`) ^ 0xffffff)
    .toString(16)
    .substr(1)
    .toUpperCase();

  return `#${inverted}`;
};
