import "./style.css";
import style from "./style.module.css";
import dateformat from "dateformat";
import { animeLoader, AnimeLoaderData } from "../../../util/animeLoader";
import Link from "next/link";
dateformat.i18n.dayNames = [
  '日', '月', '火', '水', '木', '金', '土',
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
];
type PageType = {
  searchParams: Record<string, string>,
  params: { animeId: string, }
}
export async function generateMetadata(context: PageType) {
  const loadedData = await animeLoader.loadData().then(d => {
    const r = d.find(a => a.animeId == Number(context.params.animeId))!;
    return r;
  });
  return {
    title: `アキバ総研アーカイブ：アニメ : ${loadedData.title}`,
  }
}
export default async function Page(context: PageType) {
  const loadedData = await animeLoader.loadData().then(d => {
    const r = d.find(a => a.animeId == Number(context.params.animeId))!;
    return r;
  });;
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20">
      <h1>アニメ詳細</h1>
      <div>
        <span>タイトル：</span>
        <span>{loadedData.title}</span>
      </div>
      <div>
        <span>主カテゴリ：</span>
        <span>{loadedData.primaryCategory}</span>
      </div>
      <div>
        <span>開始時期：</span>
        <span>{loadedData.startSeason}</span>
      </div>
      <div>
        <span>アキバ総研のアニメ個別URL：</span>
        <span className="inline-flex gap-4">
          <a href={`https://akiba-souken.com/anime/${loadedData.animeId}/`} target="_blank" className={`${style["a"]}`}>公式</a>
          <a href={`https://web.archive.org/web/*/https://akiba-souken.com/anime/${loadedData.animeId}/`} target="_blank" className={`${style["a"]}`}>IA検索結果</a>
          <Link href={`/iframe?src=anime-${loadedData.animeId}`} className={`${style["a"]}`}>IAをiframe</Link>
        </span>
      </div>
      {titleReviewScore(loadedData.titleReviewScore)}
      {titleReviewList(loadedData.animeId, loadedData.titleReviewList)}
      {titleHitokotoList(loadedData.titleHitokotoList)}
      {episodeList(loadedData.episodeList)}
      {episodeHitokotoList(loadedData.episodeHitokotoList)}
    </div>
  );
}
/** 作品自体のレビューの点数 */
function titleReviewScore(titleReviewScore: AnimeLoaderData["titleReviewScore"]) {
  return (
    <>
      <h1>作品レビュー</h1>
      <div>
        <span>ストーリー：</span>
        <span>{titleReviewScore.story ?? "なし"}</span>
      </div>
      <div>
        <span>作画：</span>
        <span>{titleReviewScore.sakuga ?? "なし"}</span>
      </div>
      <div>
        <span>キャラクター：</span>
        <span>{titleReviewScore.character ?? "なし"}</span>
      </div>
      <div>
        <span>音楽：</span>
        <span>{titleReviewScore.music ?? "なし"}</span>
      </div>
      <div>
        <span>オリジナリティ：</span>
        <span>{titleReviewScore.originality ?? "なし"}</span>
      </div>
      <div>
        <span>演出：</span>
        <span>{titleReviewScore.storyboard ?? "なし"}</span>
      </div>
      <div>
        <span>声優：</span>
        <span>{titleReviewScore.voice ?? "なし"}</span>
      </div>
      <div>
        <span>歌：</span>
        <span>{titleReviewScore.song ?? "なし"}</span>
      </div>
      <div>
        <span>満足度：</span>
        <span>{titleReviewScore.manzokudo ?? "なし"}</span>
      </div>
    </>
  );
}
function titleReviewList(animeId: number, list: AnimeLoaderData["titleReviewList"]) {
  // レビューの一覧
  const PPV = 20;
  const reviewListLinks: JSX.Element[] = [];
  for (let i = 0; i < Math.ceil(list.length / PPV); i++) {
    const itemFrom = (i * PPV) + 1;
    const itemTo = Math.min(itemFrom + PPV - 1, list.length);
    if (i == 0) {
      // 1ページ目
      reviewListLinks.push(<h2 key={`review-header`}>レビュー自体の一覧</h2>)
      reviewListLinks.push(
        <div key={`review-list-${i}`}>
          <span>新着 {itemFrom}～{itemTo}件目</span>
          <span className="inline-flex gap-4">
            <a href={`https://akiba-souken.com/anime/${animeId}/review/`} target="_blank" className={`${style["a"]}`}>公式</a>
            <a href={`https://web.archive.org/web/*/https://akiba-souken.com/anime/${animeId}/review/`} target="_blank" className={`${style["a"]}`}>IA検索結果</a>
            <Link href={`/iframe?src=anime-${animeId}-review`} className={`${style["a"]}`}>IAをiframe</Link>
          </span>
        </div>
      );
    } else {
      // 2ページ目移行
      const page = i + 1;
      reviewListLinks.push(
        <div key={`review-list-${i}`}>
          <span>新着 {itemFrom}～{itemTo}件目</span>
          <span className="inline-flex gap-4">
            <a href={`https://akiba-souken.com/anime/${animeId}/review/?page=${page}`} target="_blank" className={`${style["a"]}`}>公式</a>
            <a href={`https://web.archive.org/web/*/https://akiba-souken.com/anime/${animeId}/review/?page=${page}`} target="_blank" className={`${style["a"]}`}>IA検索結果</a>
            <Link href={`/iframe?src=anime-${animeId}-review-p${page}`} className={`${style["a"]}`}>IAをiframe</Link>
          </span>
        </div>
      );
    }
  }
  const reviewList: JSX.Element[] = [];
  if (0 < list.length) {
    reviewList.push(<h2 key="head">個別のレビュー一覧</h2>)
    reviewList.push(<span key="notice">レビューの一覧だとネタバレのレビューが表示されないので、個別のレビューのリンクを作成します</span>)
    for (const v of list) {
      const timestampStr = dateformat(new Date(v.timestampSec * 1000), "yyyy/mm/dd(ddd)HH:MM:ss");
      const index = list.indexOf(v);
      reviewList.push(
        <div key={`review-list-${v.reviewId}`}>
          <span className="inline-flex gap-4">
            <span>{index + 1}/{list.length}</span>
            <a href={`https://akiba-souken.com/anime/${animeId}/review/${v.reviewId}/`} target="_blank" className={`${style["a"]}`}>公式</a>
            <a href={`https://web.archive.org/web/*/https://akiba-souken.com/anime/${animeId}/review/${v.reviewId}/`} target="_blank" className={`${style["a"]}`}>IA検索結果</a>
            <Link href={`/iframe?src=anime-${animeId}-review-${v.reviewId}`} className={`${style["a"]}`}>IAをiframe</Link>
            <span>投稿日時:{timestampStr}</span>
            <span>スコア:{v.score}</span>
            <span>ネタバレ:{v.isSpoiler ? "はい" : "いいえ"}</span>
            <span>投稿者:{v.userName}</span>
          </span>
        </div>
      );
    }
  }
  return (<>
    <h1>作品のレビュー一覧( {list.length} 件 )</h1>
    {reviewListLinks}
    {reviewList}
  </>);
}
function titleHitokotoList(list: AnimeLoaderData["titleHitokotoList"]) {
  const hitokotoList: JSX.Element[] = [];
  if (0 < list.length) {
    hitokotoList.push(<div key={`notice`}>ヒトコトは個別のURLが無いので必要最低限のみテキストを転載します</div>)
    for (const h of list) {
      const timestampStr = dateformat(new Date(h.timestampSec * 1000), "yyyy/mm/dd(ddd)HH:MM:ss")
      const index = list.indexOf(h);
      hitokotoList.push(
        <div key={`h-${h.hitokotoId}`}>
          {index + 1}/{list.length} {timestampStr} {h.reviewHtml}
        </div>
      )
    }
  }
  return (<>
    <h1>作品のヒトコト一覧( {list.length} 件 )</h1>
    {hitokotoList}
  </>);
}
function episodeList(list: AnimeLoaderData["episodeList"]) {
  const episodeElementList: JSX.Element[] = [];
  if (0 < list.length) {
    for (const e of list) {
      const index = list.indexOf(e);
      episodeElementList.push(
        <div key={`e-${e.episodeId}`}>
          {index + 1}/{list.length} 「{e.subTitle}」 ヒトコト数：{e.reviewCount} スコア：{e.score ?? "なし"}
        </div>
      )
    }
  }
  return (<>
    <h1>作品のエピソード ( {list.length} 件 )</h1>
    {episodeElementList}
  </>);
}
function episodeHitokotoList(list: AnimeLoaderData["episodeHitokotoList"]) {
  const hitokotoList: JSX.Element[] = [];
  const totalHitokotoCount = list.map(h => h.hitokotoList.length).reduce((a, b) => a + b, 0)
  if (0 < list.length) {
    hitokotoList.push(<div key={`notice`}>ヒトコトは個別のURLが無いので必要最低限のみテキストを転載します</div>)
    let index = 0;
    for (const e of list) {
      index += 1;
      for (const h of e.hitokotoList) {
        const timestampStr = dateformat(new Date(h.timestampSec * 1000), "yyyy/mm/dd(ddd)HH:MM:ss")
        hitokotoList.push(
          <div key={`h-${e.episodeId}-${h.hitokotoId}`}>
            {index}/{totalHitokotoCount} 第{e.episodeId}話のヒトコト. {timestampStr} {h.reviewHtml}
          </div>
        )
      }
    }
  }
  return (<>
    <h1>作品のエピソードごとのヒトコト ( {totalHitokotoCount} 件 )</h1>
    {hitokotoList}
  </>);
}
export async function generateStaticParams() {
  const loadedData = await animeLoader.loadData();
  return loadedData.map(c => {
    return { animeId: String(c.animeId) };
  }) satisfies PageType["params"][];
}