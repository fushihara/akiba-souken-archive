import Link from "next/link";
type ArticlePage = {
  type: "article",
  articleId: number,
  subPageNumber?: number,
}
type AnimeTop = {
  type: "animeTop",
  animeId: number,
};
type AnimeReviewList = {
  type: "animeReviewList",
  animeId: number,
  /** 0始まり */
  pageNumber: number,
};
type AnimeReviewItem = {
  type: "AnimeReviewItem",
  animeId: number,
  reviewId: number,
};
type Common = { showLinkUnderline?: boolean }
type Option = (ArticlePage | AnimeTop | AnimeReviewList | AnimeReviewItem) & Common;
export function ArciveLinkElement(option: Option) {
  const officialLinkTitle = `公式のakiba-souken.com へのリンク。閉鎖後は繋がらなくなるはず`;
  const iaSearchResultLinkTitle = `InternetArchive の検索結果へのリンク`;
  const iframeLinkTitle = `Iframeを使ってInternetArchiveに記録されたアーカイブを表示します`;
  let originalUrl = "";
  let iframeSrc = "";
  let suffixPrivate: JSX.Element = <></>;
  let className = "";
  if (option.type == "article") {
    if (option.subPageNumber == null) {
      originalUrl = `https://akiba-souken.com/article/${option.articleId}/`;
      iframeSrc = `article-${option.articleId}`;
    } else {
      originalUrl = `https://akiba-souken.com/article/${option.articleId}/?page=${option.subPageNumber}`;
      iframeSrc = `article-${option.articleId}-${option.subPageNumber}`;
      suffixPrivate = <>Page:{option.subPageNumber}</>
    }
  } else if (option.type == "animeTop") {
    originalUrl = `https://akiba-souken.com/anime/${option.animeId}/`;
    iframeSrc = `anime-${option.animeId}`
  } else if (option.type == "animeReviewList") {
    if (option.pageNumber == 0) {
      originalUrl = `https://akiba-souken.com/anime/${option.animeId}/review/`;
      iframeSrc = `anime-${option.animeId}-review`
    } else {
      const page = option.pageNumber + 1;
      originalUrl = `https://akiba-souken.com/anime/${option.animeId}/?page=${page}`;
      iframeSrc = `anime-${option.animeId}-review-p${page}`
    }
  } else if (option.type == "AnimeReviewItem") {
    originalUrl = `https://akiba-souken.com/anime/${option.animeId}/review/${option.reviewId}`;
    iframeSrc = `anime-${option.animeId}-review-${option.reviewId}`;
  } else {
    throw new Error();
  }
  if (option.showLinkUnderline == true) {
    className = `original-href`;
  }
  return (
    <>
      <a
        href={originalUrl}
        target="_blank"
        className={`transition duration-300 ease-in-out hover:text-gray-900 ${className}`}
        title={officialLinkTitle}
      >公式</a>
      <a
        href={`https://web.archive.org/web/*/${originalUrl}`}
        target="_blank"
        className={`transition duration-300 ease-in-out hover:text-gray-900 ${className}`}
        title={iaSearchResultLinkTitle}
      >IA検索結果</a>
      <Link
        href={`/iframe?src=${iframeSrc}`}
        className={`transition duration-300 ease-in-out hover:text-gray-900 ${className}`}
        title={iframeLinkTitle}
      >IAをiframe</Link>
      {suffixPrivate}
    </>
  )
}