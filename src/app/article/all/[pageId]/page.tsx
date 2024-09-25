import { ArticleLoader } from "../../../../util/articleLoader";
import dateformat from "dateformat";
import { ArticleListElement } from "../../_components/articleListElement";
import { PPV } from "../../../../util/consts";
import { chunk } from "../../../../util/arrayChunk";
import { pagenationElement } from "../../_components/pagenationElement";
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
  const chunkdData = chunk(loadedData.articles, PPV);
  const displayData = chunkdData[pageId - 1];
  return (
    <div className="p-1 gap-16">
      {pagenationElement(pageId, chunkdData.length, getHrefBuilder)}
      <div className="text-right">全:{loadedData.articles.length}件</div>
      {ArticleListElement(displayData, loadedData.categoryTag)}
      {pagenationElement(pageId, chunkdData.length, getHrefBuilder)}
    </div>
  );
}
function getHrefBuilder(page: number): string {
  return `/article/all/page-${page}`;
}
function getPageIdNumber(pageIdStr: string) {
  const m = pageIdStr.match(/page-(\d+)/)!;
  const id = Number(m[1]);
  return id;
}
//export const dynamicParams = true;
export async function generateStaticParams() {
  const loadedData = await ArticleLoader.instance.loadData();
  const chunkdData = chunk(loadedData.articles, PPV);
  return chunkdData.map((data, index) => {
    return { pageId: `page-${index + 1}`, data: data };
  });
}
