import Link from "next/link";
import { ArticleLoader } from "../../../util/articleLoader";
import "./style.css";
type PageType = {
  searchParams: Record<string, string>,
  params: {
    tagName: string,
  }
}
export async function generateMetadata(context: PageType) {
  return {
    title: `アキバ総研アーカイブ：カテゴリ一覧`,
  }
}
export default async function Page(context: PageType) {
  const tagList = await new ArticleLoader().getCategoryList();
  const categoryListElement: JSX.Element[] = [];
  tagList.forEach(t => {
    categoryListElement.push(<span key={t.name}><Link href={`/article/category/${t.name}`}>{t.name}({t.count})</Link></span>)
  })
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20">
      <h1>記事にセットされているカテゴリの一覧</h1>
      <div className="flex gap-2">
        {categoryListElement}
      </div>
    </div>
  );
}
