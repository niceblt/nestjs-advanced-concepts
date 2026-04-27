import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import format from 'string-format';
import type * as Schema from '../assets/locales/en.json';
import * as en from '../assets/locales/en.json';
import * as pl from '../assets/locales/pl.json';

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[]> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}.${Join<Extract<R, string[]>>}`
        : never
      : string;
@Injectable({ scope: Scope.REQUEST, durable: true })
export class I18nService {
  constructor(
    @Inject(REQUEST) private readonly payload: { localeCode: string },
  ) {}
  public static readonly defaultLanguage = 'en';
  public static readonly supportedLangauges = ['en', 'pl'];
  private readonly locales: Record<string, typeof Schema> = { en, pl };

  translate(
    key: Join<PathsToStringProps<typeof Schema>>,
    ...args: Array<string | Record<string, unknown>>
  ): string {
    const locale =
      this.locales[this.payload.localeCode ?? I18nService.defaultLanguage];

    const text: string = key.split('.').reduce((o, i) => o[i], locale);
    return format(text, ...args);
  }
}
