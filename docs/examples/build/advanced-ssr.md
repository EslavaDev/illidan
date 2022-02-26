# Advanced Server Side Rendering app

Here you will find basic configuration to build your first Advanced SSR application

## Configure scripts

Add these scripts to your package.json scripts section

```json
{
  "scripts": {
    "client:watch": "illidan client-build --mode=development --watch",
    "client:build": "illidan client-build --mode=production",
    "server:build": "illidan server-build",
    "server:dev": "illidan server-dev ./src/index.ts --watch",
    "start": "node lib/index.js"
  }
}
```
## Application setup

Create your View in `src/app/pages/example/view.jsx`

```jsx
import { useState } from "react";
import './styles.scss';

export const ExampleView = () => {
    const [count, setCount] = useState(0);
    const sayHi = () => alert('hi!')
    return (
        <div className="example-view-container">
            <h1>Example view</h1>
            <section>
                <p>This is an example view</p>
                <button onClick={sayHi}>Say hi!</button>
                <button onClick={() => setCount(count++)}>{count}</button>
            </section>
        </div>
    );
}
```

Create your client file in `src/app/pages/example/client.jsx`
```jsx
import { hydrate } from '@conekta/illidan/client';
import { ExampleView } from './view';

hydrate(() => <ExampleView />);
```

Create illidan config file `illidan.config.js` in the root of your project to setup your client entry.

```js
module.exports = {
  clientEntry: {
      'example.view': './src/app/pages/example/client.jsx'
  }
}
```

Create your controller in `src/app/pages/example/controller.jsx`
```jsx
import ExampleView from './view'

export const ExampleController = (req, res) => {
    res.reactRender(() => <ExampleView />, {
        title: 'Example page',
        clientName: 'example.view', // clientName is the clientEntry defined in illidan.config
    })
}

```
Create your app router in `src/app/server.js`

```jsx
import { Router } from '@conekta/illidan/server';
import { ExampleController } from './pages/example/controller';

const router = Router();

router.get('/example', ExampleController)

module.exports = router;
```

Init the app with your router in `src/index.js`.
```js
import initApp from '@conekta/illidan';
import  App from 'app/server';

initApp({
    appRouter: App,
});

```

## Run for development

In a first tab run this command to build and watch static files in development mode:
```bash
npm run client:watch
```

In a second tab run this command to run the server in development mode:
```bash
npm run server:dev
```

Your app will be available in https://localhost:8082

## Run for production
Remember to reference the scope in the **NODE_ENV** var.

```bash
npm run client:build && npm run server:build
npm start
```
