# Code Splitting

React 17 does not support dynamic imports in server rendering natively, cronos uses [Loadable Components](https://loadable-components.com/) to enable this feature

## How-to-use

```js
import { loadable } from '@conekta/cronos/dynamic';

const DynamicComponent = loadable(() => import('./dynamic-component'));

export const MainView = () => {
    return (
        <div>
            <DynamicComponent />
        </div>
    )
}
```