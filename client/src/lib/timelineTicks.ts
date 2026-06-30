/** Ported verbatim from public/javascripts/browser_utils.js (getCenturies/getYears). */

/** Returns the century-year marks (...1500, 1600...) strictly between start and end. */
export const getCenturies = (start: number, end: number): number[] => {
  const s = Math.ceil(start / 100);
  const e = Math.floor(end / 100);

  const result: number[] = [];
  for (let i = s; i <= e; i++) {
    result.push(i * 100);
  }
  return result;
};

/**
 * Timeline axis tick values: century marks, plus the exact start/end years
 * themselves when they're far enough from the nearest century mark to be
 * worth a dedicated label (and snapped onto it when they're close enough
 * that a separate label would be redundant clutter).
 */
export const getYears = (start: number, end: number): number[] => {
  const diffLarge = 25;
  const diffSmall = 10;

  const centuries = getCenturies(start, end);

  let startLabels: number[] = [];
  let endLabels: number[] = [];

  const firstCentury = centuries[0];
  if (firstCentury !== undefined) {
    const startDiff = firstCentury - start;
    if (startDiff >= diffLarge) {
      startLabels = [start];
    } else if (startDiff <= diffSmall) {
      centuries[0] = start; // replace first century with the exact start year
    }

    const lastIndex = centuries.length - 1;
    const lastCentury = centuries[lastIndex] as number; // non-empty here, so always defined
    const endDiff = end - lastCentury;
    if (endDiff >= diffLarge) {
      endLabels = [end];
    } else if (endDiff <= diffSmall) {
      centuries[lastIndex] = end; // replace last century with the exact end year
    }
  } else {
    // No century falls within [start, end] (e.g. both years fall in the
    // same century, like 1620-1650). The original's equivalent code path
    // silently produces an empty tick array here (cs[0]/cs[idx] are
    // `undefined`, every comparison becomes `NaN >= x` and is always
    // false) -- an axis with zero labels. Deliberate, documented deviation:
    // fall back to showing just the start/end years, since a labelless
    // axis is a worse outcome than this and the original behavior reads as
    // an oversight rather than an intentional choice.
    startLabels = [start];
    endLabels = [end];
  }

  return [...startLabels, ...centuries, ...endLabels];
};
