import { ArticleLoader } from "../../../../util/articleLoader";
import { ArticleListElement } from "../../_components/articleListElement";
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
  const loadedData = await ArticleLoader.instance.loadData()
  const filterdArticles = loadedData.articles.filter(article => {
    if (article.tags.includes(nowPageTagName)) {
      return true;
    }
    if (article.breadLinks.includes(nowPageTagName)) {
      return true;
    }
    return false;
  });
  return (
    <div className="p-1 gap-16">
      <div className="text-center">タグ:{nowPageTagName} の記事一覧</div>
      <div className="text-right">全:{filterdArticles.length}件</div>
      {ArticleListElement(filterdArticles, loadedData.categoryTag)}
    </div>
  );
}
export async function generateStaticParams() {
  const articleData = await ArticleLoader.instance.loadData();
  const result: { tagName: string }[] = [];
  for (const tag of articleData.categoryTag.data.keys()) {
    result.push({ tagName: tag });
  }
  return result;
}
