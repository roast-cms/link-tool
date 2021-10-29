# `link-tool`

> A Node.js API for managing affiliate links.

This project creates an API service which will return a link (most likely a URL) in response to a key (could be another url) and parameters (like locale). You can use the returned URL to either create redirects (link cloaking) or to simply manage links the HTML of your blog, website, or a tool. This tools is currently in development -- see [releases](https://github.com/roast-cms/link-tool/releases).

## API:

#### GET `/recommends/widget?locale=usa`

```json
{
  "link": "https://shop.com/usa/widget?referral=you"
}
```

For this example to work, MongoDB collection `links` should have the following document:

```json
{
  "key": "widget",
  "links": [
    {
      "link": "https://shop.com/usa/widget?referral=you",
      "locale": "usa"
    }
  ]
}
```

## Usage (with React):

This an example using React framework, however, the idea would be the same in any kind of project (both on server and on the browser):

1. Make an XHR (or fetch) request to `link-tool` service with the key (must be a short string) as a URL path and any parameters sent as a query.
2. Wait for response.
3. Use the response to create link in the returned HTML (though this could be any language your app is built in).

```javascript
export const MyPage = () => {
  // manage state of the app (React-specific)
  const [myLink, setMyLink] = useState("#default-link");

  // send fetch request on page load and update state
  useEffect(() => {
    try {
      const linkResponse = await fetch("/recommends/widget?locale=usa");
      const linkResponseJson = await linkResponse.json();
      setMyLink(linkResponseJson.link);
    } catch(error) {
      console.log(error);
    }
  },[]);

  // return page HTML
  return <div>This is my example text, oh, and look: an affiliate <a href={myLink}>link</link>!</div>
}
```

## Installation:

You will need to run a Node.js server and a MongoDB server with Redis caching server to manage your links. You will need to manage your links using the pattern described in the API docs (above). You will not have to run a separate Node.js server if you already have one -- this app can be added to your `server.js` file (or similar) to work with an `Express.js` router.

## To Do:

- [x] Initialize project in Node.js with Mongoose (MongoDB)
- [x] TypeScript and Jest
- [ ] Add locale selection logic
- [ ] Allow link disabling/archiving
