/**
 * Port of public/javascripts/list_of_names.js (FamilyName + ListOfNames) as
 * a pure reducer + selectors, replacing the old AngularJS-scope-mutating
 * "class". One behavior consolidation versus the original: the old
 * duplicate-add guard lived in the caller (`if (!lofn.contains(str))` in
 * famvis.js) — here it lives in the reducer itself, so ADD is idempotent
 * regardless of caller discipline.
 */

export interface NameEntry {
  name: string;
  color: string;
}

export type NamesListAction =
  | { type: 'ADD'; name: string; color: string }
  | { type: 'REMOVE'; index: number }
  | { type: 'RESET' };

const sortByName = (entries: NameEntry[]): NameEntry[] =>
  [...entries].sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

export const namesListReducer = (state: NameEntry[], action: NamesListAction): NameEntry[] => {
  switch (action.type) {
    case 'ADD': {
      if (containsName(state, action.name)) return state;
      return sortByName([...state, { name: action.name, color: action.color }]);
    }
    case 'REMOVE':
      return state.filter((_, index) => index !== action.index);
    case 'RESET':
      return [];
    default:
      return state;
  }
};

export const findNameIndex = (entries: NameEntry[], name: string): number =>
  entries.findIndex((entry) => entry.name === name);

export const containsName = (entries: NameEntry[], name: string): boolean => findNameIndex(entries, name) > -1;

export const getColorForName = (entries: NameEntry[], name: string): string | undefined =>
  entries.find((entry) => entry.name === name)?.color;

export const getNames = (entries: NameEntry[]): string[] => entries.map((entry) => entry.name);
