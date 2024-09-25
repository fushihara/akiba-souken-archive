import Link from "next/link";
import { ArticleLoader } from "../../../../util/articleLoader";
import dateformat from "dateformat";
import { createPagenation } from "../../../../util/pagenation";
import { ArticleListElement } from "../../_components/articleListElement";
dateformat.i18n.dayNames = [
  '日', '月', '火', '水', '木', '金', '土',
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
];
type PageType = {
  searchParams: Record<string, string>,
  params: {
    pageId: string,
  }
}
export async function generateMetadata(context: PageType) {
  const pageId = getPageIdNumber(context.params.pageId);
  return {
    title: `アキバ総研アーカイブ：ページ ${pageId}`,
  }
}
export default async function Page(context: PageType) {
  const pageId = getPageIdNumber(context.params.pageId);
  const loadedData = await ArticleLoader.instance.loadData();
  const chunkdData = chunk(loadedData, PPV);
  const displayData = chunkdData[pageId - 1];
  return (
    <div className="p-1 gap-16">
      {pagenationElement(pageId, chunkdData.length)}
      <div className="text-right">全:{loadedData.length}件</div>
      {ArticleListElement(displayData)}
      {pagenationElement(pageId, chunkdData.length)}
    </div>
  );
}
function pagenationElement(now: number, max: number) {
  const pagenationData = createPagenation({ now: now, max: max, between: 2 });
  const liElements: JSX.Element[] = [];
  for (const v of pagenationData) {
    if (v.type == "back") {
      if (v.link == null) {
        liElements.push(
          <li key={v.key}>
            <span className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
              </svg>
            </span>
          </li>
        );
      } else {
        liElements.push(
          <li key={v.key}>
            <Link href={`/article/all/page-${v.link}`} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Previous</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
              </svg>
            </Link>
          </li>
        );
      }
    } else if (v.type == "next") {
      if (v.link == null) {
        liElements.push(
          <li key={v.key}>
            <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
              </svg>
            </span>
          </li>
        );
      } else {
        liElements.push(
          <li key={v.key}>
            <Link href={`/article/all/page-${v.link}`} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Next</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
              </svg>
            </Link>
          </li>
        );
      }
    } else if (v.type == "num") {
      if (v.link == null) {
        if (v.num == now) {
          liElements.push(
            <li key={v.key}>
              <span
                className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >{v.num}</span>
            </li>
          );
        } else {
          liElements.push(
            <li key={v.key}>
              <span
                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >{v.num}</span>
            </li>
          );
        }
      } else {
        liElements.push(
          <li key={v.key}>
            <Link
              href={`/article/all/page-${v.link}`}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >{v.num}</Link>
          </li>
        );
      }
    } else if (v.type == "sp") {
      <li key={v.key}>
        <span
          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >...</span>
      </li>
    }
  }
  return (
    <nav className="flex justify-center pt-10">
      <ul className="flex items-center -space-x-px h-10 text-base">
        {liElements}
      </ul>
    </nav>
  );
}
function getPageIdNumber(pageIdStr: string) {
  const m = pageIdStr.match(/page-(\d+)/)!;
  const id = Number(m[1]);
  return id;
}
const PPV = Number(process.env["AKIBA_SOUKEN_AR_ITEM_PPV"] ?? "100");
if (!Number.isInteger(PPV)) {
  throw new Error(`AKIBA_SOUKEN_AR_ITEM_PPVに整数をセットして下さい`);
}
//export const dynamicParams = true;
export async function generateStaticParams() {
  const loadedData = await ArticleLoader.instance.loadData();
  const chunkdData = chunk(loadedData, PPV);
  return chunkdData.map((data, index) => {
    return { pageId: `page-${index + 1}`, data: data };
  });
}

function chunk<T = any>(list: T[], len: number) {
  if (len <= 0) {
    throw new Error();
  }
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += len) {
    result.push(list.slice(i, i + len));
  }
  return result;
}