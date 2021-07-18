import type { Router } from "express-serve-static-core";

interface I18nArgs {
    langs: string[];
    defaultLang: string;
    locales: Record<string, Record<'translation', any>>;
}

interface Args {
    enableOidcRoutes?: boolean;
    appRouter?: Router;
    apiRouter?: Router;
    i18n?: I18nArgs;
}

declare const initApp: (props: Args) => void;
export = initApp;
