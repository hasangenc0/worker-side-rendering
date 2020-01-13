# 🚀 Load pages 2x times faster 

## About this repository
This app built for showing how to cut html payload with service workers. (insipired by [this article](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/))

## Idea
Main idea is using service workers to caching only template of the page (not full page) and serving just content of the page when user sends request to server.

## How
I create both `template-only` and `react` (ssr) app to apply this architecture.

- `/` page is server side preact app that hydrates in client side.
- `/trendyol` page is just server side app that doesn't have client side rendering.

#### Steps
1) Create content only version of the page. (in this app `/?contentOnly=true` sends just content of the page)
2) Split your page's parts to micro templates and serve them.
3) Cache your templates with service workers.
4) Configure your service workers to render that templates in proper routes and datas.
5) Set up your cache invalidation system.

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
