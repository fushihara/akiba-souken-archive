import Link from "next/link";
import dateformat from "dateformat";
import { ArticleLoader } from "../../../util/articleLoader";
dateformat.i18n.dayNames = [
  '日', '月', '火', '水', '木', '金', '土',
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
];
type DisplayData = Awaited<ReturnType<ArticleLoader["loadData"]>>[number];
export function ArticleListElement(displayData: DisplayData[]) {
  return (
    <table className="w-full">
      <thead className="bg-white border-b sticky top-0 text-md font-medium text-gray-900">
        <tr>
          <th scope="col" className="px-6 py-4 text-left">
            No
          </th>
          <th scope="col" className="px-6 py-4 text-left">
            カテゴリ
          </th>
          <th scope="col" className="px-6 py-4 text-left">
            タイトル
          </th>
          <th scope="col" className="px-6 py-4 text-left">
            日時
          </th>
        </tr>
      </thead>
      <tbody className="">
        {displayData.map(d => {
          const officialLinkTitle = `公式のakiba-souken.com へのリンク。閉鎖後は繋がらなくなるはず`;
          const iaSearchResultLinkTitle = `InternetArchive の検索結果へのリンク`;
          const iframeLinkTitle = `Iframeを使ってInternetArchiveに記録されたアーカイブを表示します`;
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
                  <a href={`https://akiba-souken.com/article/${d.articleId}/?page=${page}`} target="_blank" className="transition duration-300 ease-in-out hover:text-gray-900" title={officialLinkTitle}>公式</a>
                  <a href={`https://web.archive.org/web/*/https://akiba-souken.com/article/${d.articleId}/?page=${page}`} target="_blank" className="transition duration-300 ease-in-out hover:text-gray-900" title={iaSearchResultLinkTitle}>IA検索結果</a>
                  <Link href={`/iframe?src=article-${d.articleId}-${page}`} className="transition duration-300 ease-in-out hover:text-gray-900" title={iframeLinkTitle}>IAをiframe</Link> Page:{page}
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
              breadChildElement.push(<Link href={`/article/tag/${bread}`} className="transition duration-300 ease-in-out hover:text-gray-900" key={`bread-${bread}`}>{bread}</Link>);
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
              }
              tagChildElements.push(<Link href={`/article/tag/${tag}`} className="transition duration-300 ease-in-out hover:text-gray-900" key={`tag-${tag}`}>{tag}</Link>);
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
          return (
            <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-sm text-gray-900 font-light">
              <td className="px-1 py-1">{d.articleId}</td>
              <td className="px-1 py-1">
                <Link href={`/article/tag/${topCategory}`} className="transition duration-300 ease-in-out hover:text-gray-900 original-href" >{topCategory}</Link>
              </td>
              <td className="px-1 py-1">
                <div>{d.title}</div>
                <div className="flex gap-4 text-xs text-gray-300">
                  <a href={originalUrl} target="_blank" className="transition duration-300 ease-in-out hover:text-gray-900" title={officialLinkTitle}>公式</a>
                  <a href={`https://web.archive.org/web/*/${originalUrl}`} target="_blank" className="transition duration-300 ease-in-out hover:text-gray-900" title={iaSearchResultLinkTitle}>IA検索結果</a>
                  <Link href={`/iframe?src=article-${d.articleId}`} className="transition duration-300 ease-in-out hover:text-gray-900" title={iframeLinkTitle}>IAをiframe</Link>
                  {breadElement}
                  {tagElement}
                  {hatebuElement}
                </div>
                {page2After}
              </td>
              <td className="px-1 py-1">{timestampStr}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}