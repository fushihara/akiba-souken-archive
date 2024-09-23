import { ArticleLoader } from "../../../../util/articleLoader";
import { ArticleListElement } from "../../_components/articleListElement";
type PageType = {
  searchParams: Record<string, string>,
  params: {
    categoryName: string,
  }
}
export async function generateMetadata(context: PageType) {
  return {
    title: `アキバ総研アーカイブ：カテゴリ ${decodeURIComponent(context.params.categoryName)}`,
  }
}
export default async function Page(context: PageType) {
  const al = new ArticleLoader()
  const nowPageCategoryName = decodeURIComponent(context.params.categoryName);
  const loadedData = await al.loadData().then(articles => {
    const filterd = articles.filter(article => {
      if (article.breadLinks.length == 0) {
        return false;
      }
      const category = article.breadLinks[0];
      if (category == nowPageCategoryName) {
        return true;
      } else {
        return false;
      }
    });
    return filterd;
  });
  return (
    <div className="p-1 gap-16">
      <div className="text-center">カテゴリ:{nowPageCategoryName} の記事一覧</div>
      <div className="text-right">全:{loadedData.length}件</div>
      {ArticleListElement(loadedData)}
    </div>
  );
}
export async function generateStaticParams() {
  const categoryList = await new ArticleLoader().getCategoryList();
  return categoryList.map((data, index) => {
    return { categoryName: data.name };
  });
}
