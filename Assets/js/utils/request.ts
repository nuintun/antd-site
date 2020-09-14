/**
 * @module request
 * @description 站点异步请求函数
 */

import 'whatwg-fetch';
import { message } from 'antd';
import { history, isDevelopment } from '~js/utils/utils';

export interface RequestOptions extends RequestInit {
  notify?: boolean;
  query?: { [key: string]: any };
}

export interface RequestResult {
  code: number;
  msg?: string;
  payload?: any;
}

interface RequestError extends Error {
  code?: number;
  payload?: any;
}

let expando: number = Date.now();

const STATUS_TEXT: { [code: number]: string } = {
  401: '未经授权',
  403: '无权操作',
  404: '接口未找到',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
};

function getStatusMessage(code: number): string {
  return STATUS_TEXT[code] || `未知错误：${code}`;
}

/**
 * @function jsonType
 * @param {string} type
 * @returns {boolean}
 */
function jsonType(type: string): boolean {
  return !!type && /^application\/json(?:;|$)/i.test(type);
}

/**
 * @function urlencodedType
 * @param {string} type
 * @returns {boolean}
 */
function urlencodedType(type: string): boolean {
  return !!type && /^application\/x-www-form-urlencoded(?:;|$)/i.test(type);
}

/**
 * @function unauthorized
 * @returns {number}
 */
function unauthorized(): number {
  return setTimeout(() => history.push('/login'));
}

/**
 * @function jsonParser
 * @param {Response} response
 * @param {boolean} notify
 * @returns {Promise}
 */
function jsonParser(response: Response, notify: boolean): Promise<any> {
  return response
    .json()
    .catch((error: RequestError): never => {
      error.code = response.status;

      if (isDevelopment) error.message = '数据解析失败，请检查数据格式';

      throw error;
    })
    .then((json: RequestResult): any => {
      switch (json.code) {
        case 200:
          if (notify) message.success(json.msg);

          // 操作成功
          return json.payload;
        case 401:
          // 需要登录认证
          unauthorized();
        default:
          // 其它错误，403 等
          const error: RequestError = new Error(json.msg || getStatusMessage(json.code));

          error.code = json.code;
          error.payload = json.payload;

          throw error;
      }
    });
}

/**
 * @function bodySerializer
 * @param {any} body
 * @param {boolean} jsonType
 * @returns {string|null}
 */
function bodySerializer(body: any, jsonType?: boolean): BodyInit | null {
  return body ? (jsonType ? JSON.stringify(body) : new URLSearchParams(body as string).toString()) : null;
}

/**
 * @function request
 * @description Ajax 数据请求
 * @param {string} input
 * @param {object} [init]
 * @param {any} [init.body]
 * @param {object} [init.query]
 * @param {boolean} [init.cache]
 * @param {boolean} [init.notify]
 * @param {object} [init.headers]
 * @param {boolean} [init.credentials]
 * @returns {Promise<any>}
 */
export default function request(input: string, init: RequestOptions = {}): Promise<any> {
  const url = new URL(input, location.href);
  const { query, cache = false, notify = true, ...options } = init;

  options.headers = new Headers(options.headers || {});
  options.credentials = options.credentials || 'include';

  console.log(url.toString());

  // 禁用缓存
  if (!cache) url.searchParams.append('_', `${expando++}`);

  // 查询参数
  if (query) Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

  // 请求头
  const { headers } = options;

  // 设置 XMLHttpRequest 头
  headers.set('X-Requested-With', 'XMLHttpRequest');

  // 设置 POST/PUT 内容类型头
  if (/POST|PUT/i.test(options.method as string)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      options.body = bodySerializer(options.body);
    } else {
      const contentType: string = headers.get('Content-Type') as string;

      // 检测传送数据方式
      if (urlencodedType(contentType)) {
        options.body = bodySerializer(options.body);
      } else if (jsonType(contentType)) {
        options.body = bodySerializer(options.body, true);
      }
    }
  }

  // Sent request
  return fetch(url.href, options)
    .catch((error: RequestError): never => {
      error.code = 503;

      if (!isDevelopment) error.message = getStatusMessage(error.code);

      throw error;
    })
    .then((response: Response): any => {
      switch (response.status) {
        case 200:
          // 获取类型
          const type: string = response.headers.get('Content-Type') as string;

          // 根据类型解析返回结果
          return jsonType(type) ? jsonParser(response, notify) : response.text();
        case 401:
          // 需要登录认证
          unauthorized();
        default:
          // 其它错误，403，404，500 等
          const { status }: Response = response;
          const error: RequestError = new Error(getStatusMessage(status));

          error.code = status;

          throw error;
      }
    });
}
