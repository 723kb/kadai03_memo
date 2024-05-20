# ①課題番号-プロダクト名

kadai03_memo

## ②課題内容（どんな作品か）

日本語で入力した内容をMyMemory APIを利用し、中国語に翻訳。
翻訳結果を保存することができるアプリ。

## ③DEMO

https://723kb.github.io/kadai03_memo/

## ④作ったアプリケーション用のIDまたはPasswordがある場合

ID: 今回はなし
PW: 今回はなし

## ⑤工夫した点・こだわった点

まず純粋なメモ帳アプリを作成後、そのコードを再利用する形で翻訳メモアプリを作成した。
上海ディズニーに行こうと思っているので、その時に利用できるのではと思い言語は中国語にした。
シンプルで使いやすいよう意識した。
GitHubで公開できるようにAPIキーなしで使える翻訳APIを使用した。
アロー関数で記載した。

## ⑥難しかった点・次回トライしたいこと(又は機能)

アロー関数にチャレンジしたが、書くことも読むことも不慣れで自分の書いたコードがわからなくなることがあった。
できるかわからないが、文字だけでなく実際に発音も確認できるようにしたい。

## ⑦質問・疑問・感想、シェアしたいこと等なんでも

[感想]
前回課題でクエリパラメーターを学習していたためなんとなくならわかるが、翻訳APIを利用する部分の関数の書き方が難しかった。
今まで使ったことのないforeach, .then, catchメソッドを理解するのが難しかった。
コールバック関数や非同期処理など基本をもっと勉強する必要があると感じた。

[参考記事]
1. [https://mymemory.translated.net/ja/] 翻訳API MyMemory。使い方はChat GPTに聞いた方が早いかもしれない。
2. [https://fontawesome.com/] ゴミ箱アイコンはここから使用。はじめにCDNコードを読み込ませて、好きなアイコンのコードを貼るだけ。シンプルで可愛い。
3. 各メソッドなどの基礎知識。　①foreach　→[https://camp.trainocate.co.jp/magazine/javascript-foreach/] ②filter→[https://camp.trainocate.co.jp/magazine/howto-javascript-filter/]　③Promise→[https://qiita.com/cotton11aq/items/e4719a7deacb7663a0b8] 

