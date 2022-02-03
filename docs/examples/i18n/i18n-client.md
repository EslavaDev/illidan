# Client i18n config

You can use i18n importing cronos utility

```jsx
import { useTranslation } from '@conekta/cronos/i18n';

export const ExampleComponent = () => {
    const { t } = useTranslation()
    return (
        <h1>{t('hello.world')}</h1>
    );
}
```

For more information see: https://react.i18next.com/