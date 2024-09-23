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
  const [iframeUrl, setIframeUrl] = useState("abount:blank");
  const [iaSearchPageUrl, setIaSearchPageUrl] = useState("abount:blank");
  useEffect(() => {
    const paramString = new URL(document.location.href).searchParams.get("src") ?? "";
    const showOriginalUrl = parseParam(paramString);
    if (showOriginalUrl != null) {
      const iaUrlKey = `20241001000000`;// 同じURLで記事が更新されている場合もあるので、最終版であろう2024/10/01 00:00:00を指定
      const iframeUrl = `https://web.archive.org/web/${iaUrlKey}if_/${showOriginalUrl}`;
      setIframeUrl(iframeUrl);
      const iaSeachPageUrlStr = `https://web.archive.org/web/*/${showOriginalUrl}`;
      setIaSearchPageUrl(iaSeachPageUrlStr);
    }
  }, []);
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-center">InternetArchiveの検索結果のURL: <Link href={iaSearchPageUrl} className="original-href">{iaSearchPageUrl}</Link></div>
      <div className="text-center">iframeのURL: <Link href={iframeUrl} className="original-href" title="日付の部分は固定値だが、適切な日付に自動的にリダイレクトされるので問題なし">{iframeUrl}</Link></div>
      <div className="text-center text-xs">※アキバ総研のページをIneternetArchiveで見る時はJavascriptを無効化しないと、強制的にリダイレクトされてしまいます</div>
      <div className="w-full flex-1 flex flex-col">
        <div className="text-center text-3xl text-red-600">以下のページはInternetArchiveに保存されている内容です。</div>
        <iframe src={iframeUrl} sandbox="" className="flex-1 border-solid border-black border p-4 bg-gray-700"></iframe>
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
  }
  return null;
}
