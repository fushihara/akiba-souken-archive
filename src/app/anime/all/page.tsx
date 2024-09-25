import { AnimeLoader } from "../../../util/animeLoader";
import style from "./style.module.css";
import Link from "next/link";
type PageType = {
  searchParams: Record<string, string>,
  params: {}
}
export async function generateMetadata(context: PageType) {
  return {
    title: `アキバ総研アーカイブ：アニメ一覧`,
  }
}
export default async function Page(context: PageType) {
  const loadedData = await AnimeLoader.instance.loadData();
  return (
    <div className="p-1 gap-16">
      <div className="text-right">全:{loadedData.length}件</div>
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
              開始時期
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              満足度
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              タイトル
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              レビュー件数
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              ヒトコト件数
            </th>
          </tr>
        </thead>
        <tbody className="">
          {loadedData.map(d => {
            return (
              <tr className={`bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 text-sm text-gray-900 font-light`}>
                <td className={`px-6 py-1 whitespace-nowrap ${style["akiba-souken-archive-anchor"]}`}>
                  <Link href={`/anime/${d.animeId}`}>{d.animeId}</Link>
                </td>
                <td className="px-6 py-1 whitespace-nowrap">{d.primaryCategory}</td>
                <td className="px-6 py-1 whitespace-nowrap">{d.startSeason}</td>
                <td className={`px-6 py-1 whitespace-nowrap ${d.titleReviewScore.manzokudo == null ? "text-gray-300" : ""}`}>{d.titleReviewScore.manzokudo ?? "なし"}</td>
                <td className="px-6 py-1 whitespace-nowrap">{d.title}</td>
                <td className={`px-6 py-1 whitespace-nowrap ${d.titleReviewList.length == 0 ? "text-gray-300" : ""}`}>{d.titleReviewList.length}</td>
                <td className={`px-6 py-1 whitespace-nowrap ${d.titleHitokotoList.length == 0 ? "text-gray-300" : ""}`}>{d.titleHitokotoList.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
