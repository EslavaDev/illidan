import e from 'express'
import {React} from "react";
import { I18NextRequest } from "i18next-http-middleware";

interface reactRenderOpts {
    title: string;
    /**
     * clientName MUST BE the webpack entry name, this will be use to load hydrate chunks and styles
     *
     * it's REQUIRED even if you will render static markup (style loading).
     */
    clientName: string;
    toStaticMarkup?: boolean;
}

declare global {
    namespace Express {
        export interface Response {
            reactRender: (Component: React.ComponentType, opts: reactRenderOpts) => Promise<void> | void;
            sendJsAsset: (assetName: string) => void
        }
        export interface Request extends  I18NextRequest {
            locals: Record<string, any>;
        }
    }
}

export = e
