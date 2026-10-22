import { createKeySet, hasKey, keyToken } from '../keyMap';

describe('keyMap', () => {
  it('treats number and string keys as different', () => {
    const set = createKeySet([1, '2']);
    expect(hasKey(set, 1)).toBe(true);
    expect(hasKey(set, '1')).toBe(false);
    expect(hasKey(set, '2')).toBe(true);
    expect(hasKey(set, 2)).toBe(false);
    expect(keyToken(1)).not.toBe(keyToken('1'));
  });

  it('handles empty input', () => {
    expect(hasKey(createKeySet(null), 'a')).toBe(false);
    expect(hasKey(createKeySet([]), undefined)).toBe(false);
  });
});
