import { Router, HandlerContext } from "service-worker-router";
import { getText } from "./helpers";
import Mustache from "mustache";
import render from "preact-render-to-string";
import { h } from "preact";
import { App } from "../components/App";

declare const self: ServiceWorkerGlobalScope;

const PRECACHE = "worker-side-rendering-cache-v1";
const RUNTIME = "worker-side-rendering-cache-runtime";
const CONTENT_KEY = "contentOnly";

class ServiceWorkerOne {
  router = new Router();
  constructor() {
    this.router.get("/", this.home);
    this.router.get("/trendyol", this.trendyol);
  }

  public run(): void {
    addEventListener("install", ServiceWorkerOne.onInstalled);
    addEventListener("activate", ServiceWorkerOne.onActivate);
    addEventListener("fetch", this.onFetched);
  }

  public static onInstalled = (event: any): void => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then(cache => {
          return cache.addAll([
            "/template",
            "/trendyol/partials/header",
            "/trendyol/partials/footer",
            "/trendyol/partials/template"
          ]);
        })
        .then(self.skipWaiting())
    );
  };

  // Define trendyol home page handler
  public home = async ({ request }: HandlerContext): Promise<Response> => {
    const contentUrl = new URL(request!.url);
    contentUrl.searchParams.append("contentOnly", "true");
    let data = { header: "", footer: "", content: "" };
    const [template] = await Promise.all([
      getText(caches.match("/template")),
      fetch(contentUrl.href, { headers: request?.headers })
        .then(res => res.json())
        .then(res => (data = res))
    ]);
    const html = render(<App {...data} />);
    return new Response(Mustache.render(template, { html }), {
      headers: { "content-type": "text/html" }
    });
  };

  // Define trendyol home page handler
  public trendyol = async ({ request }: HandlerContext): Promise<Response> => {
    const contentUrl = new URL(request!.url);
    contentUrl.searchParams.append("contentOnly", "true");
    let content = {};

    const [header, footer, template] = await Promise.all([
      getText(caches.match("/trendyol/partials/header")),
      getText(caches.match("/trendyol/partials/footer")),
      getText(caches.match("/trendyol/partials/template")),
      fetch(contentUrl.href, { headers: request?.headers })
        .then(res => res.json())
        .then(res => (content = res))
    ]);

    return new Response(
      Mustache.render(template, { content, header, footer }),
      {
        headers: { "content-type": "text/html" }
      }
    );
  };

  public onFetched = (event: any): void => {
    const url = new URL(event.request.url);
    if (url.searchParams.has(CONTENT_KEY)) {
      event.respondWith(fetch(url.href));
    } else if (event.request.url.startsWith(self.location.origin)) {
      this.router.handleEvent(event);
    }
  };

  // The activate handler takes care of cleaning up old caches.
  public static onActivate = (event: any): void => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
          );
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  };
}

new ServiceWorkerOne().run();
