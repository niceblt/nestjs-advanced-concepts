import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { pick } from 'accept-language-parser';
import { Request } from 'express';
import { I18nService } from '../i18n/i18n.service.js';
export class AggregateByLocaleContextIdStrategy implements ContextIdStrategy {
  private readonly locales = new Map<string, ContextId>();
  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const localeCode =
      pick(
        I18nService.supportedLangauges,
        request.headers['accept-language'] as string,
      ) ?? I18nService.defaultLanguage;

    let localeSubTreeId: ContextId;
    if (this.locales.has(localeCode)) {
      localeSubTreeId = this.locales.get(localeCode) as ContextId;
    } else {
      localeSubTreeId = ContextIdFactory.create();
      this.locales.set(localeCode, localeSubTreeId);
    }

    return {
      payload: { localeCode },
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? localeSubTreeId : contextId,
    };
  }
}
