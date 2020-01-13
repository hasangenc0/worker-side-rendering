/** Tell the service worker to skip waiting. Resolves once the controller has changed. */
export class Offline {
  init() {
    if (typeof navigator.serviceWorker === 'undefined') {
      return;
    }

    const url = new URL(location.href);
    const noCache = url.searchParams.has("no-cache");

    if (noCache) {
      const reg = navigator.serviceWorker.getRegistration();

      reg.then(r => {
        if (r) {
          r.unregister().then(() => {
            location.reload();
          });
        }
        return;
      })
    }
    navigator.serviceWorker.register("/sw.js");
  }
}
