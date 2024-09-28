import "./style.css"
export default function Home() {
  return (
    <div className="p-8">
      アキバ総研( <a href="https://akiba-souken.com/" target="_blank" className={`original-href`}>https://akiba-souken.com/</a> ) の記事一覧をアーカイブしたページです。このサイト内にアキバ総研の記事本文はありません。<br />
      アキバ総研は2024/08/01にサービス終了のアナウンスが行われ、2024/08/31に記事の更新が停止しました。<br />
      このアーカイブは2024/08/31～2024/09/30 の間に取得していますが、特定の瞬間のスナップショットではないので、データの不整合がある可能性があります。<br />
      アキバ総研は記事ページ内にドメインがakiba-souken.com でない場合にトップページにリダイレクトされるjavascriptが仕込まれていますので、InternetArchiveから閲覧する時はdevtool等でjsをオフにする必要があります。<br />
      このページはGithubActions＆GithubPagesでデプロイされています。生データが欲しい方は下記のレポジトリをチェックアウトする事をおすすめします。
      <h3>アキバ総研とは？</h3>
      アキバ総研はカカクコムが2002/08から2024/09まで公開していたアキバ系ニュースサイトです。<br />
      初期のURLは http://kakaku.com/akiba/ 形式で、価格.comのサブディレクトリにありました。<br />
      2007年頃から http://akiba.kakaku.com/ に移動し、2011年頃から https://akiba-souken.com/ ドメインに移動しました。<br />
      過去の記事の継続性についてですが、少なくともkakaku.comドメイン配下のURLは2024/09時点で全てakiba-souken.comのトップページにリダイレクトされてアクセス出来ませんでした。<br />
      akiba-souken.com内の最古の記事のタイムスタンプは2006/12/14なので、akiba.kakaku.comから akiba-souken.com への移行は行われたのかもしれませんが、最初期の記事はInternetArchiveにしか無い模様です<br />
      その他にもPCパーツのレビュー機能が2014/09/30のリニューアルで削除されていたりします。記事がメインコンテンツではありますが、それ以外のサブコンテンツは既に永久に失われているものがあります。<br />
      <a href="https://mevius.5ch.net/test/read.cgi/esite/1690495133/595" className={`original-href`}>https://mevius.5ch.net/test/read.cgi/esite/1690495133/595</a> も参照。
      <h3>このアーカイブサイトについて</h3>
      ソースコード、データは以下のレポジトリに一式があります。nodeのnext.jsのSSGでGithubPagesサイトを構築しています。<br />
      <a href="https://github.com/fushihara/akiba-souken-archive" className={`original-href`}>https://github.com/fushihara/akiba-souken-archive</a><br />
      このサイトの記事一覧などが欲しい場合は、スクレイピングをするより上記レポジトリからファイルを落としたほうが早いです。<br />
      スクレイピングに使ったツール一式は以下の通りです。こちらのスクリプトはdenoを使っています。DLしたhtmlをsqliteに保存して、同じ内容で複数アクセスが起きないように工夫しています。<br />
      <a href="https://github.com/fushihara/akiba-souken-crawler" className={`original-href`}>https://github.com/fushihara/akiba-souken-crawler</a>
      <p />
      このアーカイブサイトは閉鎖決定時点の全てのコンテンツを網羅している訳ではありません。<br />
      通常のarticle形式以外の、投票( https://akiba-souken.com/vote/ )、アニメランキング( https://akiba-souken.com/anime/ranking/ )は抜けています。<br />
    </div>
  );
}
