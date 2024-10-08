import { chunk } from "../../../../util/arrayChunk";
import { ArticleLoader } from "../../../../util/articleLoader";
import { PPV } from "../../../../util/consts";
import { ArticleListElement } from "../../_components/articleListElement";
import { pagenationElement } from "../../_components/pagenationElement";
type PageType = {
  searchParams: Record<string, string>,
  params: {
    tagName: string,
  }
}
export async function generateMetadata(context: PageType) {
  return {
    title: `アキバ総研アーカイブ：タグの記事一覧 ${context.params.tagName}`,
  }
}
export default async function Page(context: PageType) {
  const nowPageTagName = decodeURIComponent(context.params.tagName);
  const categoryTag = await ArticleLoader.instance.getCategoryTag();
  const loadedData = await ArticleLoader.instance.getTagArticle(nowPageTagName);
  const chunkdData = chunk(loadedData, PPV);
  const displayData = chunkdData[0];
  return (
    <div className="p-1 gap-16">
      <div className="text-center">タグ:{nowPageTagName} の記事一覧</div>
      <div className="text-right">全:{loadedData.length}件</div>
      {pagenationElement(1, chunkdData.length, getHrefBuilder(nowPageTagName))}
      {ArticleListElement(displayData, categoryTag)}
      {pagenationElement(1, chunkdData.length, getHrefBuilder(nowPageTagName))}
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
  const result: { tagName: string }[] = [];
  for (const tag of articleData.categoryTag.data.keys()) {
    result.push({ tagName: tag });
  }
  return result;
}
