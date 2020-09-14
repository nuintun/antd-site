/**
 * @module utils
 */

import { createBrowserHistory, History } from 'history';
import { debounce as originDebounce } from 'throttle-debounce';

const toString = Object.prototype.toString;

/**
 * @type {History}
 * @description 浏览器历史
 */
export const history: History = createBrowserHistory();

/**
 * @type {boolean}
 * @description 是否是开发环境
 */
export const isDevelopment: boolean = process.env.NODE_ENV === 'development';

/**
 * @function isString
 * @description 是否为字符串
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value: any): value is string {
  return toString.call(value) === '[object String]';
}

/**
 * @function formatThousands
 * @description 格式化数字
 * @param {number} number
 * @param {number} fixed
 * @returns {string}
 */
export function formatThousands(number: number = 0, fixed: number = 2): string {
  if (window.Intl) {
    return new window.Intl.NumberFormat('en-us', {
      minimumFractionDigits: fixed,
      maximumFractionDigits: fixed
    }).format(number);
  }

  const parts: string[] = number.toFixed(fixed).split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

/**
 * @function createMarkup
 * @description 生成 React HTML 字符串
 * @param {string} html
 * @returns {object}
 */
export function createMarkup(html: string): { __html: string } {
  return { __html: html };
}

// type DebounceDecorator = <T>(
//   target: Object,
//   propertyKey: string | symbol,
//   descriptor: TypedPropertyDescriptor<T> & { initializer?: () => any }
// ) => (TypedPropertyDescriptor<T> & { initializer?: () => any }) | void;

/**
 * @function debounce
 * @description debounce 修饰器
 * @param {number} delay
 * @param {boolean} atBegin
 * @returns {function}
 */
export function debounce(delay: number, atBegin: boolean = false): MethodDecorator {
  return function debounce<T>(
    _target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): void | TypedPropertyDescriptor<T> {
    const { writable, enumerable, configurable }: TypedPropertyDescriptor<T> = descriptor;

    return {
      enumerable,
      configurable,
      get: function () {
        // Attach this function to the instance (not the class)
        Object.defineProperty(this, propertyKey, {
          writable,
          enumerable,
          configurable,
          value: originDebounce(delay, atBegin, descriptor.value as any)
        });

        return this[propertyKey];
      }
    };
  };
}

const nativeStorage: Storage = self.localStorage;

/**
 * @namespace {object} storage
 */
export const storage = {
  /**
   * @method has
   * @description 是否存在指定缓冲
   * @param {string} key
   * @returns {boolean}
   */
  has(key: string): boolean {
    return nativeStorage.hasOwnProperty(key);
  },
  /**
   * @method set
   * @description 设置缓存
   * @param {string} key
   * @param {any} value
   */
  set(key: string, value: unknown): boolean {
    try {
      nativeStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch {
      return false;
    }
  },
  /**
   * @method get
   * @description 读取指定缓存
   * @param {string} key
   * @returns {any}
   */
  get(key: string): unknown {
    try {
      return JSON.parse(nativeStorage.getItem(key) as string);
    } catch {
      // Do nothing
    }
  },
  /**
   * @method remove
   * @description 删除指定缓存
   * @param {string} key
   */
  remove(key: string): void {
    nativeStorage.removeItem(key);
  }
};

/**
 * @function urlToList
 * @description 将 URL 拆分成路径列表
 * @param {string} url
 */
export function urlToList(url: string): string[] {
  if (url === '/') {
    return ['/'];
  }

  const paths: string[] = url.split('/').filter(path => path);

  return paths.map((_path, index) => `/${paths.slice(0, index + 1).join('/')}`);
}
