const types = require('./types');

const buildSelectors = (UAHelper) => ({
  uaInstance: UAHelper.UAInstance,
  isSmartTV: types.isSmartTVType(UAHelper.device),
  isConsole: types.isConsoleType(UAHelper.device),
  isWearable: types.isWearableType(UAHelper.device),
  isEmbedded: types.isEmbeddedType(UAHelper.device),
  isMobileSafari: types.isMobileSafariType(UAHelper.browser),
  isChromium: types.isChromiumType(UAHelper.browser),
  isMobile: types.isMobileAndTabletType(UAHelper.device),
  isMobileOnly: types.isMobileType(UAHelper.device),
  isTablet: types.isTabletType(UAHelper.device),
  isBrowser: types.isBrowserType(UAHelper.device),
  isDesktop: types.isBrowserType(UAHelper.device),
  isAndroid: types.isAndroidType(UAHelper.os),
  isWinPhone: types.isWinPhoneType(UAHelper.os),
  isIOS: types.isIOSType(UAHelper.os),
  isChrome: types.isChromeType(UAHelper.browser),
  isFirefox: types.isFirefoxType(UAHelper.browser),
  isSafari: types.isSafariType(UAHelper.browser),
  isOpera: types.isOperaType(UAHelper.browser),
  isIE: types.isIEType(UAHelper.browser),
  isEdge: types.isEdgeType(UAHelper.browser),
  isYandex: types.isYandexType(UAHelper.browser),
  isLegacyEdge:
    types.isEdgeType(UAHelper.browser) &&
    !types.isEdgeChromiumType(UAHelper.ua),
  isWindows: types.isWindowsType(UAHelper.os),
  isMacOs: types.isMacOsType(UAHelper.os),
  isMIUI: types.isMIUIType(UAHelper.browser),
  isSamsungBrowser: types.isSamsungBrowserType(UAHelper.browser),
});

module.exports = { buildSelectors };
