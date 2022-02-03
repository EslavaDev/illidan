# Dynamic Views

You can use dynamic views to deliver different content to the user according to the parameters you want to validate (device type, business logic, etc).

Each view has the ability to have its static hydration independent, this will reduce the load impact on the user's browser.

## How-to-use

```jsx
import { Mobileview } from './views/MobileView'
import { DesktopView } from './views/DesktopView'

export const ExampleController = (req, res) => {
    const title = 'Example Page'
    if(req.isMobile) {
        res.reactRender(Mobileview, {
            clientName: 'example.mobile',
            title
        })
        return
    }
    res.reactRender(DesktopView, {
        clientName: 'example.desktop',
        title
    })
}
```