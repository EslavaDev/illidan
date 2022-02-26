# Basic Single page application

Here you will find basic configuration to build your first Basic SPA application.

## Configure scripts

Add these scripts to your package.json scripts section

```json
{
  "scripts": {
    "dev": "illidan client-serve --mode=development --port=9090",
    "build": "illidan client-build --mode=production",
    "test": "illidan test -c"
  }
}
```

## Application setup

Create your initial entry point in `src/index.jsx`

```jsx
import { render } from 'react-dom';
import './styles.scss'

const App = () => {
    return (
      <div className="container">
        <h1>Hello world</h1>
      </div>
    );
}

render(<App />, document.getElementById('root'))
```

Create your html template in `src/index.html.ejs`

```html
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My first app</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

Create a `illidan.config.js` file in the root of your project:

```js
module.exports = {
  clientEntry: './src/index.jsx',
  spa: {
    htmlTemplate: './src/index.html.ejs',
    publicPath: '/'
  },
  jest: {
    // setupBeforeTest: require.resolve('./config/jest/setupBeforeTest'),
  }
}
```

## Start development server

```shell
npm run dev
```

Your application is now served in: https://dev.conektame.io:9090

## Build for production

```shell
npm run build
```

The compiled files will be available in `public` folder