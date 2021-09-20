# Cronos

Node.js library to build server apps using react as live template **(Server Side Rendering)**

## Before install

Conekta packages are distributed by github registry. Check that your project has an `.npmrc` file with the following content:
```
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
@conekta:registry=https://npm.pkg.github.com
```
`NPM_TOKEN` is a github personal access token. You can create one [here](https://github.com/settings/tokens) and enable `read:packages` permission, that will allow you to download `@conekta` scoped packages.

## Installation
```bash
npm i @conekta/cronos
```
## Basic Usage
Configure the env variables for every scope in the root of your project.

```
.env.development
.env.sandbox
.env.staging
.env.production
```
Create your first router.
```jsx
// src/app/server.js
import { Router } from '@conekta/cronos/server';
import { paymentLink } from "app/pages/hosted-checkout/controller";

const router = Router();

router.get('/hello-world', (req, res) => {
    res.reactRender(() => <h1>Hello world</h1>, {
        title: 'Hello world',
        toStaticMarkup: true,
    })
})
router.get('/foo', (req, res) => {
    res.send({ foo: 'bar' })
})

export default router;

```
Init the app with your router.
```js
// src/index.js
import initApp from '@conekta/cronos';
import initMocks from '@conekta/cronos/mocks';
import App from 'app/server'

if (process.env.NODE_ENV !== 'production') {
    initMocks('https://panelb.conektame.io/*');
}

initApp({
    appRouter: App,
});

```

## Run for development

```bash
cronos server-dev ./src/index.js --watch
```

## Run for production
Remember to reference the scope in the **NODE_ENV** var.

```bash
cronos server-build
node -r @conekta/cronos/register ./lib/index.js
```
