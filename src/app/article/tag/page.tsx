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
  type TAG = { tag: string, count: number, primary?: boolean };
  const elementListPcPart: TAG[] = [];
  const elementListAkiba: TAG[] = [];
  const elementListAnime: TAG[] = [];
  const elementListAnimeSeason: TAG[] = [];
  const elementListGame: TAG[] = [];
  const elementListHobby: TAG[] = [];
  const elementListOther: TAG[] = [];
  for (const tag of tagList) {
    if (tag.category == "PCパーツ") {
      elementListPcPart.push({ tag: tag.tag, count: tag.count, primary: tag.tag == "PCパーツ" });
    } else if (tag.category == "アキバ") {
      elementListAkiba.push({ tag: tag.tag, count: tag.count, primary: tag.tag == "アキバ" });
    } else if (tag.category == "アニメ") {
      elementListAnime.push({ tag: tag.tag, count: tag.count, primary: tag.tag == "アニメ" });
    } else if (tag.category == "ゲーム") {
      elementListGame.push({ tag: tag.tag, count: tag.count, primary: tag.tag == "ゲーム" });
    } else if (tag.category == "ホビー") {
      elementListHobby.push({ tag: tag.tag, count: tag.count, primary: tag.tag == "ホビー" });
    } else if (tag.tag.match(/^\d+(春|夏|秋|冬)?アニメ$/)) {
      elementListAnimeSeason.push({ tag: tag.tag, count: tag.count });
    } else if (tag.tag == "G.E.M.シリーズ") {
      elementListHobby.push({ tag: tag.tag, count: tag.count });
    } else if (["3DS", "PS4ゲームレビュー", "PS Vita", "PS5ゲームレビュー", "Switchインディーズ", "ポケモンGO", "Steamゲームレビュー"].includes(tag.tag)) {
      elementListGame.push({ tag: tag.tag, count: tag.count });
    } else {
      elementListOther.push({ tag: tag.tag, count: tag.count });
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