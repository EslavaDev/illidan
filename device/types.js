const { DeviceTypes, BrowserTypes, OsTypes } = require('./constants');

exports.isMobileType = ({ type }) => type === DeviceTypes.Mobile;
exports.isTabletType = ({ type }) => type === DeviceTypes.Tablet;
exports.isMobileAndTabletType = ({ type }) =>
  type === DeviceTypes.Mobile || type === DeviceTypes.Tablet;
exports.isSmartTVType = ({ type }) => type === DeviceTypes.SmartTv;
exports.isBrowserType = ({ type }) => type === DeviceTypes.Browser;
exports.isWearableType = ({ type }) => type === DeviceTypes.Wearable;
exports.isConsoleType = ({ type }) => type === DeviceTypes.Console;
exports.isEmbeddedType = ({ type }) => type === DeviceTypes.Embedded;

// os types
exports.isAndroidType = ({ name }) => name === OsTypes.Android;
exports.isWindowsType = ({ name }) => name === OsTypes.Windows;
exports.isMacOsType = ({ name }) => name === OsTypes.MAC_OS;
exports.isWinPhoneType = ({ name }) => name === OsTypes.WindowsPhone;
exports.isIOSType = ({ name }) => name === OsTypes.IOS;

// browser types
exports.isChromeType = ({ name }) => name === BrowserTypes.Chrome;
exports.isFirefoxType = ({ name }) => name === BrowserTypes.Firefox;
exports.isChromiumType = ({ name }) => name === BrowserTypes.Chromium;
exports.isEdgeType = ({ name }) => name === BrowserTypes.Edge;
exports.isYandexType = ({ name }) => name === BrowserTypes.Yandex;
exports.isSafariType = ({ name }) =>
  name === BrowserTypes.Safari || name === BrowserTypes.MobileSafari;
exports.isMobileSafariType = ({ name }) => name === BrowserTypes.MobileSafari;
exports.isOperaType = ({ name }) => name === BrowserTypes.Opera;
exports.isIEType = ({ name }) =>
  name === BrowserTypes.InternetExplorer || name === BrowserTypes.Ie;
exports.isMIUIType = ({ name }) => name === BrowserTypes.MIUI;
exports.isSamsungBrowserType = ({ name }) =>
  name === BrowserTypes.SamsungBrowser;
exports.isEdgeChromiumType = (ua) =>
  typeof ua === 'string' && ua.indexOf('Edg/') !== -1;
