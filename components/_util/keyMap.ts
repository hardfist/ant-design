export interface KeySet {
  [token: string]: boolean;
}

// Prefix the runtime type so numeric 1 and string "1" stay distinct.
// Object keys would otherwise coerce both to "1".
export function keyToken(key: any): string {
  return typeof key + ':' + key;
}

export function createKeySet(keys?: any[] | null): KeySet {
  const set: KeySet = Object.create(null);
  if (!keys || !keys.length) {
    return set;
  }
  for (let i = 0; i < keys.length; i++) {
    set[keyToken(keys[i])] = true;
  }
  return set;
}

export function hasKey(set: KeySet, key: any): boolean {
  return !!set && set[keyToken(key)] === true;
}
