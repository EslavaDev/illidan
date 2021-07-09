import { RequestHandler } from "express";

export const isAuthorized: (withPermissions: string[]) => RequestHandler
export const ensureAuthenticated: () => RequestHandler
export const applyUserPermissions: () => RequestHandler
export const logoutAndRevoke: () => RequestHandler
export const user: () => RequestHandler
export const handleUnauthorizedErrors: () => RequestHandler
