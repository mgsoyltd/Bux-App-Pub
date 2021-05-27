/*
 * Force a value into a number. This is currently capped to 2 decimal
 * places.
 */
export const forceNumber = (n) => {
  n = Number(n);
  if (isNaN(n) || typeof n === "undefined") {
    n = 0;
  }
  return n;
};
