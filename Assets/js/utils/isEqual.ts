const keyList: (o: object) => string[] = Object.keys;
const isArray: (arg: any) => arg is any[] = Array.isArray;
const hasProp: (v: string | number | symbol) => boolean = Object.prototype.hasOwnProperty;

/**
 * @function isEqual
 * @description 深度比较两个值是否相等
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
export default function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA: boolean = isArray(a);
    const arrB: boolean = isArray(b);

    if (arrA && arrB) {
      const length: number = a.length;

      if (length != b.length) return false;

      for (let i: number = 0; i < length; i++) {
        if (!isEqual(a[i], b[i])) return false;
      }

      return true;
    }

    if (arrA != arrB) return false;

    const dateA: boolean = a instanceof Date;
    const dateB: boolean = b instanceof Date;

    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    const regexpA: boolean = a instanceof RegExp;
    const regexpB: boolean = b instanceof RegExp;

    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    const keys: string[] = keyList(a);
    const length: number = keys.length;

    if (length !== keyList(b).length) return false;

    for (let i: number = 0; i < length; i++) {
      if (!hasProp.call(b, keys[i])) return false;
    }

    for (let i: number = 0; i < length; i++) {
      const key: string = keys[i];

      if (key === '_owner' && a.$$typeof && a._store) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!isEqual(a[key], b[key])) return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}
