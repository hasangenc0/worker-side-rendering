export function getText(responsePromise: Promise<Response | undefined>) {
  return responsePromise.then((response: Response | undefined) => response!.text());
}