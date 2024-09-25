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
  const articleData = await ArticleLoader.instance.loadData();
  type TAG = { tag: string, count: number, primary?: boolean };
  const elementListPcPart: TAG[] = [];
  const elementListAkiba: TAG[] = [];
  const elementListAnime: TAG[] = [];
  const elementListAnimeSeason: TAG[] = [];
  const elementListGame: TAG[] = [];
  const elementListHobby: TAG[] = [];
  const elementListOther: TAG[] = [];
  for (const [tag, categoryAndCount] of articleData.categoryTag.data.entries()) {
    if (categoryAndCount.category == "PCパーツ") {
      elementListPcPart.push({ tag: tag, count: categoryAndCount.count, primary: tag == "PCパーツ" });
    } else if (categoryAndCount.category == "アキバ") {
      elementListAkiba.push({ tag: tag, count: categoryAndCount.count, primary: tag == "アキバ" });
    } else if (categoryAndCount.category == "アニメ") {
      elementListAnime.push({ tag: tag, count: categoryAndCount.count, primary: tag == "アニメ" });
    } else if (categoryAndCount.category == "ゲーム") {
      elementListGame.push({ tag: tag, count: categoryAndCount.count, primary: tag == "ゲーム" });
    } else if (categoryAndCount.category == "ホビー") {
      elementListHobby.push({ tag: tag, count: categoryAndCount.count, primary: tag == "ホビー" });
    } else if (tag.match(/^\d+(春|夏|秋|冬)?アニメ$/)) {
      elementListAnimeSeason.push({ tag: tag, count: categoryAndCount.count });
    } else if (tag == "G.E.M.シリーズ") {
      elementListHobby.push({ tag: tag, count: categoryAndCount.count });
    } else if (["3DS", "PS4ゲームレビュー", "PS Vita", "PS5ゲームレビュー", "Switchインディーズ", "ポケモンGO", "Steamゲームレビュー"].includes(tag)) {
      elementListGame.push({ tag: tag, count: categoryAndCount.count });
    } else {
      elementListOther.push({ tag: tag, count: categoryAndCount.count });
    }
  }
  return (
    <div className="p-1">
      {createList("PCパーツ", elementListPcPart)}
      {createList("アキバ", elementListAkiba)}
      {createList("ゲーム", elementListGame)}
      {createList("ホビー", elementListHobby)}
      {createList("カテゴリなし", elementListOther)}
      {createList("アニメ", elementListAnime)}
      {createList("アニメ(時期別)", elementListAnimeSeason)}
    </div>
  );
}
function createList(headerLabel: string, tagList: { tag: string, count: number, primary?: boolean }[]) {
  const sortedList = tagList.toSorted((a, b) => {
    if (a.primary == true) {
      return -1;
    } else if (b.primary == true) {
      return 1;
    } else {
      return b.count - a.count;
    };
  })
  const elementList: JSX.Element[] = [];
  sortedList.forEach(t => {
    elementList.push(
      <Link href={`/article/tag/${t.tag}`} key={`list-${tagList.indexOf(t)}`} className="original-href">{t.tag}({t.count})</Link>
    )
  })
  return (<>
    <h1>{headerLabel}</h1>
    <div className="flex gap-2 flex-wrap">
      {elementList}
    </div>
  </>);
}