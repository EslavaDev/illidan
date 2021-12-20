import e from 'express'
import {React} from "react";
import { I18NextRequest } from "i18next-http-middleware";
import { UAParserInstance } from 'ua-parser-js';

interface reactRenderOpts {
    title: string;
    /**
     * clientName MUST BE the webpack entry name, this will be use to load chunks and styles
     */
    clientName?: string;
    toStaticMarkup?: boolean;
}

interface DeviceDetect {
    uaInstance: UAParserInstance;
    isSmartTV: boolean;
    isConsole: boolean;
    isWearable: boolean;
    isEmbedded: boolean;
    isMobileSafari: boolean;
    isChromium: boolean;
    isMobile: boolean;
    isMobileOnly: boolean;
    isTablet: boolean;
    isBrowser: boolean;
    isDesktop: boolean;
    isAndroid: boolean;
    isWinPhone: boolean;
    isIOS: boolean;
    isChrome: boolean;
    isFirefox: boolean;
    isSafari: boolean;
    isOpera: boolean;
    isIE: boolean;
    isEdge: boolean;
    isYandex: boolean;
    isLegacyEdge: boolean;
    isWindows: boolean;
    isMacOs: boolean;
    isMIUI: boolean;
    isSamsungBrowser: boolean;
}

declare global {
    namespace Express {
        export interface Response {
            reactRender: (Component: React.ComponentType, opts: reactRenderOpts) => Promise<void> | void;
            sendJsAsset: (assetName: string) => void
        }
        export interface Request extends  I18NextRequest {
            device: DeviceDetect;
            locals: Record<string, any>;
            nonce: string;
        }
    }
}

export = e
