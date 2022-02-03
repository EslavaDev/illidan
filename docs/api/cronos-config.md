# Cronos config file

Cronos config file is required to setup and/or customize initial config for your application.

| Property    | Description                                                                                                                                            | Type                      | Default   |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|-----------|
| clientEntry | client entry points configuration, here you should list the static files to be compiled by webpack. See: https://webpack.js.org/concepts/entry-points/ | Array, String, Object     | undefined |
| spa         | Config to be applied to your SPA application                                                                                                           | `CronosSpaConfig`         | undefined |
| jest        | Custom jest config to be applied for your unit test                                                                                                    | `CronosJestConfig`        | undefined |
| extendCSP   | Customize Content-Security-Policy headers for your application (Only available in SSR apps)                                                            | `CronosCSPConfig`         | undefined |

## CronosSpaConfig

| Property        | Description                                                                              | Type   | Default |
|-----------------|------------------------------------------------------------------------------------------|--------|---------|
| publicPath      | Customize the public path of your app. See: https://webpack.js.org/guides/public-path/   | String | `auto`  |
| htmlTemplate    | Setup the html template file path for your SPA application. Eg: ./src/index.html         | String | null    |
| federatedModule | Setup Webpack Module federation. See: https://webpack.js.org/concepts/module-federation/ | Object | null    |

## CronosJestConfig

| Property        | Description                                                                                                                           | Type   | Default   |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|--------|-----------|
| setupBeforeTest | Setup additional global configuration to run before all your test. See: https://jestjs.io/docs/configuration#setupfilesafterenv-array | Module | undefined |

## CronosCSPConfig

| Property   | Description                                                                                                                                                                                                                                                           | Type          | Default |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------|
| connectSrc | The HTTP Content-Security-Policy (CSP) connect-src directive restricts the URLs which can be loaded using script interfaces. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src                                       | Array<String> | []      |
| scriptSrc  | The HTTP Content-Security-Policy (CSP) script-src directive specifies valid sources for JavaScript. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src                                                                 | Array<String> | []      |
| frameSrc   | The HTTP Content-Security-Policy (CSP) frame-src directive specifies valid sources for nested browsing contexts loading using elements such as `frame` and `iframe`. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src | Array<String> | []      |