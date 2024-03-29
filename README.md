# 🚀 Load pages 2x times faster 

## About this repository
This app built for showing how to cut html payload with service workers. (insipired by [this article](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/))

## Idea
Main idea is using service workers to caching only templates of the parts of the page (not contains data) and serving just content to feed those templates when browser sends request to server.

## How
* Server Configuration
  * `/` and `/trendyol` routes serve full html with content.
  * If this routes have `?contentOnly=true` parameter, server just sends the content of that page.
  * Serve templates.
  * `/template` serves template of the `/` page.
  * `/trendyol/partials/:partial` serves multiple templates of the `/trendyol` page.
 
* Service Worker Configuration
  * After installation of service worker cache the templates of that page.
  * When browser sends request again, block the request.
  * Fetch only content of the page using `?contentOnly=true` parameter.
  * Render templates with fetched content.
  * Return response that contains generated html.

## Performance Metrics
<a href="https://ibb.co/YRWLnvS"><img src="https://i.ibb.co/xCs79Vb/Screen-Shot-2020-01-12-at-22-26-24.png" alt="Screen-Shot-2020-01-12-at-22-26-24" border="0"></a>

<a href="https://ibb.co/4Fh7BBZ"><img src="https://i.ibb.co/RgR9LLp/Screen-Shot-2020-01-12-at-22-20-38.png" alt="Screen-Shot-2020-01-12-at-22-20-38" border="0"></a>

<a href="https://ibb.co/fGjjjmg"><img src="https://i.ibb.co/prYYYC7/Screen-Shot-2020-01-12-at-22-20-55.png" alt="Screen-Shot-2020-01-12-at-22-20-55" border="0"></a>

This metrics measured by [@philipwalton](https://github.com/philipwalton)

## Building locally
````
npm run build
````

You can run server with
````
npm run start
````
