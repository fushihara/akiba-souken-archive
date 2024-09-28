import Link from "next/link";
import dateformat from "dateformat";
import { ArticleLoader } from "../../../util/articleLoader";
import { TableElement } from "../../_components/tableElements";
import { ArciveLinkElement } from "../../_components/archiveLinkElement";
dateformat.i18n.dayNames = [
  '日', '月', '火', '水', '木', '金', '土',
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
];
type DisplayData = Awaited<ReturnType<ArticleLoader["loadData"]>>["articles"][number];
type CategoryTagData = Awaited<ReturnType<ArticleLoader["loadData"]>>["categoryTag"]
export function ArticleListElement(displayData: DisplayData[], categoryTag: CategoryTagData) {
  const result = TableElement({
    header: [
      { label: "No" },
      { label: "カテゴリ" },
      { label: "タイトル" },
      { label: "日付" },
    ]
  }, displayData.map(d => {
    return getDisplayData(d, categoryTag);
  }));
  return result;
}
function getDisplayData(d: DisplayData, categoryTag: CategoryTagData) {
  const topCategory = d.breadLinks[0];
  const timestampStr = dateformat(new Date(d.timestampMs), "yyyy/mm/dd(ddd)HH:MM");
  const originalUrl = `https://akiba-souken.com/article/${d.articleId}/`;
  const page2After = (() => {
    if (d.maxPageNumber == 1) {
      return [(<></>)];
    }
    const result: JSX.Element[] = [
      (<hr key={`hr`} />)
    ];
    for (let page = 2; page <= d.maxPageNumber; page++) {
      result.push(
        <div className="flex gap-4 text-xs text-gray-300" key={`page-${page}`}>
          {ArciveLinkElement({ type: "article", articleId: d.articleId, subPageNumber: page })}
        </div>
      );
    }
    return result;
  })();
  // パンくずリスト部分を作成
  let breadElement = (<span key={`notice`}></span>);
  if (0 < d.breadLinks.length) {
    const breadChildElement: JSX.Element[] = [];
    breadChildElement.push(<span className="mr-[-0.5rem]" key={`label`}>パンくずリスト：</span>);
    for (const bread of d.breadLinks) {
      if (d.breadLinks.indexOf(bread) != 0) {
        breadChildElement.push(<span>＞</span>);
      }
      const tagCount = categoryTag.getTagCount(bread);
      breadChildElement.push(
        <Link
          href={`/article/tag/${bread}`}
          className="transition duration-300 ease-in-out hover:text-gray-900"
          key={`bread-${bread}`}
        >{bread}({tagCount})</Link>
      );
    }
    breadElement = (
      <span className="flex gap-0.5">
        {breadChildElement}
      </span>
    );
  }
  // タグ部分を作成
  let tagElement = (<span key={`notice`}>タグ無し</span>);
  if (d.tags.length != 0) {
    const tagChildElements: JSX.Element[] = [];
    tagChildElements.push(<span className="mr-[-0.5rem]" key={`label`}>タグ：</span>);
    for (const tag of d.tags) {
      if (d.tags.indexOf(tag) != 0) {
        tagChildElements.push(<span>／</span>);
      };
      const tagCount = categoryTag.getTagCount(tag);
      tagChildElements.push(
        <Link
          href={`/article/tag/${tag}`}
          className="transition duration-300 ease-in-out hover:text-gray-900"
          key={`tag-${tag}`}
        >{tag}({tagCount})</Link>
      );
    }
    tagElement = (
      <span className="flex gap-0.5">
        {tagChildElements}
      </span>
    );
  }
  const hatebuElement = (
    <a href={`https://b.hatena.ne.jp/entry/${originalUrl}`}>
      <img src={`https://b.hatena.ne.jp/entry/image/${originalUrl}`} />
    </a>
  );
  const result: { element: JSX.Element }[] = [
    { element: <>{d.articleId}</> },
    { element: <Link href={`/article/tag/${topCategory}`} className="transition duration-300 ease-in-out hover:text-gray-900 original-href" >{topCategory}</Link> },
    {
      element: <>
        <div>{d.title}</div>
        <div className="flex gap-4 text-xs text-gray-300">
          {ArciveLinkElement({ type: "article", articleId: d.articleId })}
          {breadElement}
          {tagElement}
          {hatebuElement}
        </div>
        {page2After}
      </>
    },
    {
      element: <>{timestampStr}</>
    }
  ]
  return result;
}