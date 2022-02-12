export default async function proxy(url: string): Promise<Response> {
  return fetch("/proxy?url=" + url);
}
