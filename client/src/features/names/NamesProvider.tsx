import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { createColorGenerator } from '../../lib/color.js';
import { namesListReducer, type NameEntry, type NamesListAction } from './namesListReducer.js';

interface NamesContextValue {
  entries: NameEntry[];
  addName: (name: string) => void;
  removeName: (index: number) => void;
  resetNames: () => void;
}

const NamesContext = createContext<NamesContextValue | undefined>(undefined);

export function NamesProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer<NameEntry[], [NamesListAction]>(namesListReducer, []);
  const nextColor = useMemo(() => createColorGenerator(), []);

  const value = useMemo<NamesContextValue>(
    () => ({
      entries,
      addName: (name: string) => dispatch({ type: 'ADD', name, color: nextColor() }),
      removeName: (index: number) => dispatch({ type: 'REMOVE', index }),
      resetNames: () => dispatch({ type: 'RESET' }),
    }),
    [entries, nextColor]
  );

  return <NamesContext.Provider value={value}>{children}</NamesContext.Provider>;
}

export function useNamesList(): NamesContextValue {
  const ctx = useContext(NamesContext);
  if (!ctx) throw new Error('useNamesList must be used within a NamesProvider');
  return ctx;
}
