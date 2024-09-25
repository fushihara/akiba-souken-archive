import { chunk } from "../../../../../util/arrayChunk";
import { ArticleLoader } from "../../../../../util/articleLoader";
import { PPV } from "../../../../../util/consts";
import { ArticleListElement } from "../../../_components/articleListElement";
import { pagenationElement } from "../../../_components/pagenationElement";

type PageType = {
  searchParams: Record<string, string>,
  params: {
    tagName: string,
    pageNum: string,
  }
}
export async function generateMetadata(context: PageType) {
  return {
    title: `アキバ総研アーカイブ：タグの記事一覧 ${context.params.tagName}`,
  }
}
export default async function Page(context: PageType) {
  const pageNumber = Number(context.params.pageNum);
  const nowPageTagName = decodeURIComponent(context.params.tagName);
  const categoryTag = await ArticleLoader.instance.getCategoryTag();
  const loadedData = await ArticleLoader.instance.getTagArticle(nowPageTagName);
  const chunkdData = chunk(loadedData, PPV);
  const displayData = chunkdData[pageNumber - 1];
  return (
    <div className="p-1 gap-16">
      <div className="text-center">タグ:{nowPageTagName} の記事一覧</div>
      <div className="text-right">全:{loadedData.length}件</div>
      {pagenationElement(pageNumber, chunkdData.length, getHrefBuilder(nowPageTagName))}
      {ArticleListElement(displayData, categoryTag)}
      {pagenationElement(pageNumber, chunkdData.length, getHrefBuilder(nowPageTagName))}
    </div>
  );
}
function getHrefBuilder(tagName: string) {
  return (page: number) => {
    if (page == 1) {
      return `/article/tag/${tagName}/`;
    } else {
      return `/article/tag/${tagName}/${page}/`;
    }
  }
}
export async function generateStaticParams() {
  const articleData = await ArticleLoader.instance.loadData();
  const result: PageType["params"][] = [];
  for (const [tag, data] of articleData.categoryTag.data) {
    for (let page = 2; page <= Math.ceil(data.count / PPV); page++) {
      result.push({ tagName: tag, pageNum: String(page) });
    }
  }
  return result;
}
