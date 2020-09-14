import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekYear from 'dayjs/plugin/weekYear';
import isMoment from 'dayjs/plugin/isMoment';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import localeData from 'dayjs/plugin/localeData';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(weekday);
dayjs.extend(weekYear);
dayjs.extend(isMoment);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

interface Locales {
  en_GB: string;
  en_US: string;
  zh_CN: string;
  zh_TW: string;
  [key: string]: string;
}

const localeMap: Locales = {
  en_US: 'en',
  en_GB: 'en-gb',
  zh_CN: 'zh-cn',
  zh_TW: 'zh-tw'
};

function parseLocale(locale: string): string {
  const mapLocale: string = localeMap[locale];

  return mapLocale || locale.split('_')[0];
}

function antdPlugin(_option: unknown, dayjsClass: typeof Dayjs, _dayjsFactory: typeof dayjs) {
  const { locale: oldLocale }: Dayjs = dayjsClass.prototype;

  dayjsClass.prototype.locale = function (arg: string): string {
    if (typeof arg === 'string') {
      arg = parseLocale(arg);
    }

    return oldLocale.call(this, arg);
  } as { (): string; (preset: string | ILocale, object?: Partial<ILocale> | undefined): Dayjs };
}

dayjs.extend(antdPlugin);
