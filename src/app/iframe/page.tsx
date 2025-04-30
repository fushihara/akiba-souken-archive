'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
type PageType = {
  searchParams: Record<string, string>,
  params: {
    articleId: string,
  }
}
export default function Page(context: PageType) {
  const iaUrlKeyDefault = `20241001000000`;// 同じURLで記事が更新されている場合もあるので、最終版であろう2024/10/01 00:00:00を指定
  const [iframeUrl, setIframeUrl] = useState(`data:text/html,<span style="color:white;">読込中... 表示まで10秒以上の時間がかかる場合があります</span>`);
  const [iaSearchPageUrl, setIaSearchPageUrl] = useState("abount:blank");
  useEffect(() => {
    const paramSrcString = new URL(document.location.href).searchParams.get("src") ?? "";
    let paramTimeString = new URL(document.location.href).searchParams.get("time") ?? iaUrlKeyDefault;
    if (!paramTimeString.match(/^[0-9]{14}$/)) {
      paramTimeString = iaUrlKeyDefault;
    }
    const showOriginalUrl = parseParam(paramSrcString);
    if (showOriginalUrl != null) {
      let iframeUrl = `https://web.archive.org/web/${paramTimeString}if_/${showOriginalUrl}`;
      setIframeUrl(iframeUrl);
      const iaSeachPageUrlStr = `https://web.archive.org/web/*/${showOriginalUrl}`;
      setIaSearchPageUrl(iaSeachPageUrlStr);
    }
  }, []);
  const back1Month = () => {
    let paramTimeString = new URL(document.location.href).searchParams.get("time") ?? iaUrlKeyDefault;
    if (!paramTimeString.match(/^[0-9]{14}$/)) {
      paramTimeString = iaUrlKeyDefault;
    }
    const backNum = 100000000n; // 1 month
    let paramTimeBigint = BigInt(paramTimeString);
    paramTimeBigint -= backNum;
    const newUrlObj = new URL(document.location.href);
    newUrlObj.searchParams.delete("time");
    newUrlObj.searchParams.append("time", String(paramTimeBigint));
    location.href = newUrlObj.toString();
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center">InternetArchiveの検索結果のURL: <Link href={iaSearchPageUrl} className="original-href">{iaSearchPageUrl}</Link></div>
      <div className="text-center">iframeのURL: <Link href={iframeUrl} className="original-href" title="日付の部分は固定値だが、適切な日付に自動的にリダイレクトされるので問題なし">{iframeUrl}</Link></div>
      <div className="text-center text-xs">※アキバ総研のページをIneternetArchiveで見る時はJavascriptを無効化しないと、強制的にリダイレクトされてしまいます</div>
      <div className="w-full flex-1 flex flex-col">
        <div className="text-center text-3xl text-red-600">以下のページはInternetArchiveに保存されている内容です。</div>
        <div className="text-center">iframeに「サービスは終了しました」と表示された場合<button style={{ all: "revert" }} onClick={() => { back1Month() }}>1ヶ月時間を戻す</button>をクリック</div>
        <iframe src={iframeUrl} sandbox="" className="flex-1 border-solid border-black border p-4 bg-gray-700">
          Loading
        </iframe>
      </div>
    </div>
  );
}
function parseParam(paramString: string) {
  let m: RegExpMatchArray | null = null;
  if (m = paramString.match(/^article-(\d+)$/)) {
    return `https://akiba-souken.com/article/${m[1]}/`
  } else if (m = paramString.match(/^article-(\d+)-(\d+)$/)) {
    return `https://akiba-souken.com/article/${m[1]}/?page=${m[2]}`
  } else if (m = paramString.match(/^anime-(\d+)$/)) {
    return `https://akiba-souken.com/anime/${m[1]}/`;
  } else if (m = paramString.match(/^anime-(\d+)-review$/)) {
    return `https://akiba-souken.com/anime/${m[1]}/review/`;
  } else if (m = paramString.match(/^anime-(\d+)-review-p(\d+)$/)) {
    return `https://akiba-souken.com/anime/${m[1]}/review/?page=${m[2]}`;
  } else if (m = paramString.match(/^anime-(\d+)-review-(\d+)$/)) {
    return `https://akiba-souken.com/anime/${m[1]}/review/${m[2]}/`;
  } else if (m = paramString.match(/^anime-matome-(.+?)$/)) {
    return `https://akiba-souken.com/anime/matome/${m[1]}/`;
  }
  return null;
}
