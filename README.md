# `links`

> An Express.js server middleware for managing affiliate links.

This project creates an API service which will return a link URL in response to a keyword (or another URL) and parameters (like locale). You can use the returned URL to either create redirects (link cloaking) or to simply manage links the HTML of your blog, website, or a tool.

## Installation:

### Prerequisites:

- [Express.js](https://arorachakit.hashnode.dev/how-to-start-a-basic-node-and-express-server) server.
- [MongoDB](https://docs.mongodb.com/guides/server/install/) database.
- [Redis](https://www.javaniceday.com/post/install-and-run-redis-locally) server.
- A **secret** `.env` file in your root dir with a random `APPLICATION_SECRET` string & connection URIs (see `.env.example`).

### `yarn add @roast-cms/links`

### Implementation example:

```javascript
import links from "@roast-cms/links";

app.use(
  links({
    // REQUIRED redis server URL
    redisURL: process.env.REDIS_URL || "",

    // REQUIRED MongoDB URI
    databaseURI: process.env.DATABASE_URI || "",

    // REQUIRED application secret (random string for app session ID)
    applicationSecret: process.env.APPLICATION_SECRET || "",

    // OPTIONAL path name for the `links` API on local Express router
    pathName: "/recommends",
  })
);
```

Complete example can be found in `./example-server.ts` and can be run with `yarn dev:example` from this repo.

## API:

#### GET `/recommends/widget?locale=us`

```json
{
  "link": "https://shop.com/us/widget?referral=you"
}
```

For this example to work, MongoDB collection `links` should have the following document (`vendors[].locale` is optional):

```json
{
  "link": "widget",
  "vendors": [
    {
      "url": "https://shop.com/us/widget?referral=you",
      "value": 1,
      "locale": "us"
    }
  ]
}
```

## Usage (with React):

This an example using React framework, however, the idea would be the same in any kind of project (both on server and on the browser):

1. Make an XHR (or fetch) request to `links` service with the key (must be a string) as a URL path and any parameters sent as a query.
2. Wait for response.
3. Use the response to create link in the returned HTML (though this could be any language your app is built in).

```javascript
export const MyPage = () => {
  // manage state of the app (React-specific)
  const [myLink, setMyLink] = useState("#default-link");

  // send fetch request on page load and update state
  useEffect(() => {
    try {
      const linkResponse = await fetch("/recommends/widget?locale=us");
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

## To Do:

- [x] Initialize project in Node.js with Mongoose (MongoDB)
- [x] TypeScript and Jest
- [ ] Add locale selection logic
- [ ] Allow link disabling/archiving
