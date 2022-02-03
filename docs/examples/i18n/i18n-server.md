# Server i18n config

Create your langs locale in `src/i18n/locales/es.js`

```js
export default {
    pendingPayment: {
        title: '¡Ya casi terminas!'
    }
}
```

Create your i18n config in `src/i18n/index.js`

```js
import esLocales from './locales/es';

export default {
  langs: ['es', 'en'],
  defaultLang: 'es',
  locales: {
    es: { translation: esLocales },
  },
};

```

Pass i18n config to cronos:
```js
import App from 'app/server';
import i18n from './i18n';

initApp({
    appRouter: App,
    i18n,
});
```

Now you can use i18n in your controllers:

```js
export const DefaultController = (req, res) => {
    res.send({ msg: req.t('pendingPayment.title') })
}
```
