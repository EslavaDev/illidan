# Static Styled Views

You can build complete static views with first-style-loading (Avoid loading js and css chunks to the client and include styles as inline-styles in the html template)

## Setup

Install styled components package

```bash
npm i styled-components
```

## How-to-use

Create your view with styled components

```jsx
import styled from 'styled-components';

const Link = styled.a`
  color: ${({ color }) => color ?? '#fff'};
  font-weight: 600;
  text-decoration: none;
`;

const Container = styled.div`
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

export const ExampleView = () => {
    return (
        <Container>
            <ul>
                <li><Link color="#FFAA00" href="/">Home</Link></li>
                <li><Link href="/companies">Companies</Link></li>
                <li><Link href="/about">About us</Link></li>
            </ul>
        </Container>
    )
}

```
Render view in your controller
```jsx
import { ExampleView } from './view'

export const ExampleController = (req, res) => {
    res.reactRender(ExampleView, {
        title: 'Example page',
        toStaticMarkup: true,
    })
}
```