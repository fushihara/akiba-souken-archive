# ローカルで確認する方法
別タブでwebサーバーを開く
> ws -d .ssg-output -f dev

ターミナルで以下のコマンドを実行
> npm run build

ブラウザで以下のURLを開く
http://127.0.0.1:8000/akiba-souken-archive/

# URL一覧
## /iframe?src=article-67386
sandboxのiframeで表示するページ

## /article/all/page-1
全記事の一覧をページングしながら表示

## /article-search [後回し]
全記事のjsonを読み込んで動的に検索する

## /article/1234
1つの記事を表示する

## /article/1234/2
1つの記事の2ページ目以降

## /anime/all
全てのアニメ一覧

## /anime/123
個別のアニメ情報
レビュー、ヒトコト全部入り

# 更新されている記事がある
https://akiba-souken.com/article/51045/
https://web.archive.org/web/20240000000000*/https://akiba-souken.com/article/51045/
