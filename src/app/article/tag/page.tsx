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
    title: `アキバ総研アーカイブ：タグ一覧`,
  }
}
export default async function Page(context: PageType) {
  const tagList = await new ArticleLoader().getTagList();
  const tagsElement: JSX.Element[] = [];
  tagList.forEach(t => {
    tagsElement.push(<span key={t.name}><Link href={`/article/tag/${t.name}`}>{t.name}({t.count})</Link></span>)
  })
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20">
      <h1>著名なタグ一覧</h1>
      <h1>記事にセットされているタグの一覧</h1>
      <div className="flex gap-2 flex-wrap">
        {tagsElement}
      </div>
    </div>
  );
}
