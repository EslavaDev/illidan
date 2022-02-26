# Basic Server Side Rendering app

Here you will find basic configuration to build your first Basic SSR application

## Configure scripts

Add these scripts to your package.json scripts section

```json
{
  "scripts": {
    "server:build": "illidan server-build",
    "server:dev": "illidan server-dev ./src/index.ts --watch",
    "start": "node lib/index.js"
  }
}
```
## Application setup

Create your first router in `src/app/server.js`.
```jsx
const { Router } = require('@eslavadev/illidan/server');

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

module.exports = router;

```
Init the app with your router in `src/index.js`.
```js
const initApp = require('@eslavadev/illidan');
const initMocks = require('@eslavadev/illidan/mocks');
const App = require('app/server')

if (process.env.NODE_ENV === 'development') {
    initMocks('https://127.0.0.1:3001/*');
}

initApp({
    appRouter: App,
});

```

Create illidan config file `illidan.config.js` in the root of your project.

```js
module.exports = {
    // An empty object is required, you can start customizing your application config
}
```

## Run for development

```bash
npm run server:dev
```

## Run for production

```bash
npm run build && npm start
```
