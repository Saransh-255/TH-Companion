export default async function parsePage(
  url:string
) {
  let page = await fetch(url).then(data => data.text());
  let parser = new DOMParser();
  return parser.parseFromString(page, "text/html");
}