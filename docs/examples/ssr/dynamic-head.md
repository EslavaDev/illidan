# Dynamic Head

Illidan support Dynamic head (Static and SSR apps), follow these instructions to start using it.

## How-to-use

```js
import Head from '@eslavadev/illidan/declarative/Head';

export const MainView = () => {
    return (
        <>
            <Head>
                <script src={`${process.env.BASE_URL}v1.0/js/illidan-embedded-checkout.min.js`} />
                <script src={process.env.CARDINAL_SONGBIRD_URL} />
            </Head>
            <div>
                <h1>Hello world</h1>
            </div>
        </>
    )
}
```
If for any reason you need to create inline scripts (We do not recommend it) you have to set the nonce attribute ([available in express request](../../api/extending-express.md#request)) due to we do not support inline-scripts without nonce attribute.

```js
import Head from '@eslavadev/illidan/declarative/Head';

export const MainView = ({ nonce }) => {
    return (
        <>
            <Head>
                <!-- Facebook pixel script -->
                <script nonce={nonce}>{`
                    !function(f,b,e,v,n,t,s)
                      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                      n.queue=[];t=b.createElement(e);t.async=!0;
                      t.src=v;s=b.getElementsByTagName(e)[0];
                      s.parentNode.insertBefore(t,s)}(window, document,'script',
                      'https://connect.facebook.net/en_US/fbevents.js');
                      fbq('init', '{your-pixel-id-goes-here}');
                      fbq('track', 'PageView'); 
                `}</script>
            </Head>
        </>
    )
}
```