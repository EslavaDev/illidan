# Extending express

Illidan add some middlewares to extend express capabilities

## Request

| Property | Description                                                                        | Type         |
|----------|------------------------------------------------------------------------------------|--------------|
| device   | Identifies the type of device from which requests are received from the user-agent |`DeviceDetect`|
| nonce    | Word or phrase that is generated per every request                                 | string       |

### DeviceDetect

| Property   | Description           | Type             |
|------------|-----------------------|------------------|
| uaInstance | ua-parser-js instance | UAParserInstance |
| isSmartTV  | Identifier            | boolean          |
| isConsole  | Identifier            | boolean          |
| isWearable | Identifier            | boolean          |
| isEmbedded | Identifier            | boolean          |
| isMobileSafari  | Identifier            | boolean          |
| isChromium  | Identifier            | boolean          |
| isMobile  | Identifier            | boolean          |
| isMobileOnly  | Identifier            | boolean          |
| isTablet  | Identifier            | boolean          |
| isBrowser  | Identifier            | boolean          |
| isDesktop  | Identifier            | boolean          |
| isAndroid  | Identifier            | boolean          |
| isWinPhone  | Identifier            | boolean          |
| isIOS  | Identifier            | boolean          |
| isChrome  | Identifier            | boolean          |
| isFirefox  | Identifier            | boolean          |
| isSafari  | Identifier            | boolean          |
| isOpera  | Identifier            | boolean          |
| isIE  | Identifier            | boolean          |
| isEdge  | Identifier            | boolean          |
| isLegacyEdge  | Identifier            | boolean          |
| isWindows  | Identifier            | boolean          |
| isMacOs  | Identifier            | boolean          |

## Response

| Property    | Description                                                                             | Type                                                                      |
|-------------|-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| reactRender | Function to render React components in the server and serve and send them to the client | (Component: React.ComponentType, opts: IllidanRenderOpts) => Promise<void> |
| sendJsAsset | Function to send a specific static js asset                                             | (assetName: string) => void                                               |

### IllidanRenderOpts

| Property       | Description                                                                       | Type    |
|----------------|-----------------------------------------------------------------------------------|---------|
| title          | Text to be used as page title in the rendered html page                           | string  |
| clientName     | Static entry name defined illidan.config file, used to hydrate rendered html page  | string  |
| toStaticMarkup | Flag used to render a static html page or not (static html page does not hydrate) | boolean |