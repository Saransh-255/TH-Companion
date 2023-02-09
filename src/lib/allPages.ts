import { makeChunks } from "./arrOps";
import parsePage from "./parsePage";

export default async function allPages(
  pgCount: number,
  url: (page:string|number) => string,
  pageFn: (doc:Document) => boolean,
  chunkCount: number
) {
  let run = true;
  let page;
  const chunks = makeChunks([...Array(pgCount).keys()], chunkCount);

  for await (const chunk of chunks) {
    if (!run) break;
    await Promise.all(
      chunk.map(async num => {
        num++;
  
        const pageDom = await parsePage(url(num));
        run = pageFn(pageDom);
      })
    );
  }
  return page;
}