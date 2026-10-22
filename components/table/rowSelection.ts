import { keyToken } from '../_util/keyMap';

export interface SelectionUpdate {
  selectedRowKeys: any[];
  changeRowKeys: any[];
  selectWay: string;
  checked: boolean | undefined;
}

// Membership is counted instead of indexOf/splice so a full page of keys
// does not scan the selected list twice per row. Duplicate keys still
// follow the old splice order: the earliest match is the one removed.
export function updateSelectedKeys(
  currentSelectedKeys: any[],
  changeableRowKeys: any[],
  selectionKey: string,
): SelectionUpdate {
  const selectedRowKeys = currentSelectedKeys.slice();
  const selectedCounts: { [token: string]: number } = Object.create(null);
  for (let i = 0; i < selectedRowKeys.length; i++) {
    const token = keyToken(selectedRowKeys[i]);
    selectedCounts[token] = (selectedCounts[token] || 0) + 1;
  }

  const changeRowKeys: any[] = [];
  let selectWay = '';
  let checked: boolean | undefined;

  switch (selectionKey) {
    case 'all':
      changeableRowKeys.forEach(key => {
        const token = keyToken(key);
        if (!selectedCounts[token]) {
          selectedRowKeys.push(key);
          changeRowKeys.push(key);
          selectedCounts[token] = 1;
        }
      });
      selectWay = 'onSelectAll';
      checked = true;
      break;
    case 'removeAll': {
      const removeCounts: { [token: string]: number } = Object.create(null);
      changeableRowKeys.forEach(key => {
        const token = keyToken(key);
        const alreadyRemoving = removeCounts[token] || 0;
        if (alreadyRemoving < (selectedCounts[token] || 0)) {
          removeCounts[token] = alreadyRemoving + 1;
          changeRowKeys.push(key);
        }
      });
      const nextSelected = selectedRowKeys.filter(key => {
        const token = keyToken(key);
        if (removeCounts[token]) {
          removeCounts[token] -= 1;
          return false;
        }
        return true;
      });
      selectedRowKeys.length = 0;
      for (let i = 0; i < nextSelected.length; i++) {
        selectedRowKeys.push(nextSelected[i]);
      }
      selectWay = 'onSelectAll';
      checked = false;
      break;
    }
    case 'invert':
      changeableRowKeys.forEach(key => {
        const token = keyToken(key);
        if (selectedCounts[token]) {
          selectedCounts[token] -= 1;
          const at = selectedRowKeys.indexOf(key);
          if (at >= 0) {
            selectedRowKeys.splice(at, 1);
          }
        } else {
          selectedRowKeys.push(key);
          selectedCounts[token] = 1;
        }
        changeRowKeys.push(key);
        selectWay = 'onSelectInvert';
      });
      break;
    default:
      break;
  }

  return {
    selectedRowKeys,
    changeRowKeys,
    selectWay,
    checked,
  };
}
