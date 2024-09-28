import dateformat from "dateformat";
import { AnimeLoader, AnimeLoaderData } from "../../../util/animeLoader";
import { ArciveLinkElement } from "../../_components/archiveLinkElement";
dateformat.i18n.dayNames = [
  '日', '月', '火', '水', '木', '金', '土',
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
];
type PageType = {
  searchParams: Record<string, string>,
  params: { animeId: string, }
}
export async function generateMetadata(context: PageType) {
  const loadedData = await AnimeLoader.instance.loadData().then(d => {
    const r = d.find(a => a.animeId == Number(context.params.animeId))!;
    return r;
  });
  return {
    title: `アキバ総研アーカイブ：アニメまとめ`,
  }
}
export default async function Page(context: PageType) {
  const className = "flex gap-4";
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20">
      <ul>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "anison", showLinkUnderline: true, })}：アニソンまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "kami_anime", showLinkUnderline: true, })}：神アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "akuyaku", showLinkUnderline: true, })}：悪役令嬢アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "tsukkomi", showLinkUnderline: true, })}：ツッコミアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "binge_watching", showLinkUnderline: true, })}：一気見アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "youjo", showLinkUnderline: true, })}：幼女アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "kuso", showLinkUnderline: true, })}：クソアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "emo", showLinkUnderline: true, })}：エモいアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "work", showLinkUnderline: true, })}：お仕事アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "80s", showLinkUnderline: true, })}：懐かしいアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "adventure", showLinkUnderline: true, })}：冒険ファンタジーアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "journey", showLinkUnderline: true, })}：旅アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "sexy", showLinkUnderline: true, })}：セクシーアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "isekai", showLinkUnderline: true, })}：異世界アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "renai", showLinkUnderline: true, })}：恋愛アニメ（マンガ原作）まとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "seisyun", showLinkUnderline: true, })}：青春アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "stronghero", showLinkUnderline: true, })}：主人公最強アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "battle", showLinkUnderline: true, })}：バトルアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "90s", showLinkUnderline: true, })}：90年代アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "harem", showLinkUnderline: true, })}：ハーレムアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "gag", showLinkUnderline: true, })}：ギャグアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "nakeru", showLinkUnderline: true, })}：泣けるアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "guro", showLinkUnderline: true, })}：グロアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "horror", showLinkUnderline: true, })}：ホラーアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "utu", showLinkUnderline: true, })}：鬱アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "eiga", showLinkUnderline: true, })}：アニメ映画まとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "yuri", showLinkUnderline: true, })}：百合アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "bl", showLinkUnderline: true, })}：BLアニメ（ボーイズラブ）まとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "otome", showLinkUnderline: true, })}：乙女アニメ（ゲーム原作）まとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "otona", showLinkUnderline: true, })}：大人向けアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "nichijou", showLinkUnderline: true, })}：日常系アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "lightnovel", showLinkUnderline: true, })}：ラノベアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "moe", showLinkUnderline: true, })}：萌えアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "short", showLinkUnderline: true, })}：ショートアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "imouto", showLinkUnderline: true, })}：妹アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "dark", showLinkUnderline: true, })}：ダークファンタジーアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "ikemen", showLinkUnderline: true, })}：イケメンアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "timeleap", showLinkUnderline: true, })}：タイムリープアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "zombie", showLinkUnderline: true, })}：ゾンビアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "key", showLinkUnderline: true, })}：Keyアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "survival", showLinkUnderline: true, })}：サバイバルアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "gourmet", showLinkUnderline: true, })}：グルメアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "tsundere", showLinkUnderline: true, })}：ツンデレアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "future", showLinkUnderline: true, })}：近未来アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "esp", showLinkUnderline: true, })}：超能力アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "idol", showLinkUnderline: true, })}：アイドルアニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "yokai", showLinkUnderline: true, })}：妖怪アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "sengoku", showLinkUnderline: true, })}：戦国時代アニメまとめ</li>
        <li className={className}>{ArciveLinkElement({ type: "AnimeMatome", matomeId: "musical", showLinkUnderline: true, })}：ミュージカルアニメまとめ</li>
      </ul>
    </div>
  );
}
