# RestSearchApplication
---

## 提出ソースコード
提出するソースコードは以下となります。ローカルで動作させるか、github-pagesで確認できます。このアプリケーションは動作のためのサーバーなどが不要なので、ローカルにダウンロードしていただきsrcフォルダ内のindex.htmlをブラウザで開いてください。
### v1.0
[v1.0ブランチ](https://github.com/Yakiniku-Ya/RestSearchApplication/tree/v1.0)
### github-pages
[RestaurantSearch](https://yakiniku-ya.github.io/RestSearchApplication/src/index.html)

## 開発途中ソースコード
提出するソースコードは上記のv1.0ですが、後述の開発途中のものとしてv2.0をアップしています。こちらはgithub-pagesが用意できないのでローカルでの動作のみとなります。
### v2.0
[v2.0ブランチ](https://github.com/Yakiniku-Ya/RestSearchApplication/tree/v2.0)

---

## 制作にあたって
要件としてサーバーが必要と感じなかったためJavaScriptとVue.jsで制作することに決まりました。Vue.jsを選んだ点としては日本語ドキュメントが豊富なところがかなり大きいです。全体として外部パッケージの数も多くならなさそうだったのでNPMは使わずCDNを利用することとします。デザインとして複雑な画面ではなくシンプルに簡潔にまとめるようにしました。

## 仕様&機能
* 検索画面で検索した結果が一覧で表示されます。
* 検索項目としては半径検索とキーワード検索があります。
  * 2項目を同時に検索した場合はAND検索となります。
    * （例）半径:300m & キーワード:カツ丼屋 → 半径300m以内のカツ丼屋
  * キーワード検索は空白を開けることで複数の単語を入力できます
    * これらの複数の単語の検索もAND検索となります。
      * （例） キーワード:東京駅 ラーメン → 東京駅とラーメンという単語を含むお店
  * 検索項目はどちらか一方の入力でも動作します。
    * 半径であれば「指定しない」。キーワードは空白が検索しない条件になります。
* 検索結果一覧は、ページ下部の「前のページ」「次のページ」ボタンで、ページ移動ができます。
* 検索結果一覧の任意の店舗をクリックするとその店舗の詳細ページに遷移します。
* 店舗詳細ページではその店舗の詳細がずらずら並んでいます。
* ページ下部にある「ぐるなびで見る」ボタンを押すとぐるなびサイトでもっと詳細な情報が取得できます。
* すべてのページで、端末の画面サイズによって表示が変わります。
  * 1024px~：PC向けページ
  * 768px ~ 1023px：タブレット向けページ
  * ~767px：スマートフォン向けページ
* 画面遷移時に検索内容（rangeやfreeword、現在のページ）が保存されます
  * ブラウザの戻るボタンや更新ボタンなどでindex.htmlに戻った際に再度同じ情報で再検索されます。

## 開発途中&これからやりたいこと
* 他の検索方法の実施
  * 地域とか都道府県とか
  * カテゴリー検索とか
* 無限スクロールによる動的な検索結果の出力
* 店舗詳細画面にて、マップAPIを用いて地図を表示したい
* ...など

## 制作環境

|  | <3 |
|---|---|
| OS | Windows10 & MacOS |
| テキストエディタ | VisualStudioCode |
| 言語 | JavaScript & HTML & CSS|
| フレームワーク | Vue.js |
また、HTTP通信用に外部パッケージのaxiosを使用しています。

## 動作環境:ok_hand:
* Windows10
  * Google Chrome
  * Firefox
* MacOS
  * FireFox
  * Google Chrome
* iOS
  * iPhone8
    * Google Chrome
* Android OS
  * Huawei P10 Lite
    * Google Chrome

## dir
```
> webapp
    - readme.md
    > src
        > images
            - no_image.png
            - favicon.ico
        > scripts
            - index.js
            - detail.js
        > styles
            - style.css
            - main.css
            - detail.css
        - index.html
        - detail.html
```