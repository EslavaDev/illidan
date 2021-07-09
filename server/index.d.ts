import e from 'express'
import {React} from "react";
import { I18NextRequest } from "i18next-http-middleware";

interface reactRenderOpts {
    title: string;
    clientName: string;
}

declare global {
    namespace Express {
        export interface Response {
            reactRender: (Component: React.ComponentType, opts: reactRenderOpts) => Promise<void> | void;
        }
        export interface Request extends  I18NextRequest {
            locals: Record<string, any>;
            user: Record<string, any>;
            userContext: Record<string, any>;
            logout(): void
            isAuthenticated(): boolean
        }
    }
}

export = e
