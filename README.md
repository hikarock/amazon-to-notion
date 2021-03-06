# amazon-to-notion

Amazon.co.jp の書誌情報を Notion の DB に登録する Chrome 拡張機能です。

## 動作環境

Chrome 88 以降

## 使い方

1. [Notion API](https://www.notion.so/my-integrations) で integration を作成します。
   ![](https://user-images.githubusercontent.com/236607/120334613-bc97b100-c32b-11eb-87c9-d4e2c59893b1.png)
2. Notion の workspace に Database を作成して integration の権限を設定します。
   ![](https://user-images.githubusercontent.com/236607/147759063-0a14bbcf-4c01-4f1b-8f4b-c0b9ed583d10.png)
3. Database のページには以下のプロパティを追加してください。`()` 内はプロパティの種類です。
   - `Authors` (Text)
   - `Publisher` (Text)
   - `Publication Date` (Date)
   - `Media Type` (Multi-select)
   - `URL` (URL)
   - `Pages` (Number)
4. 当リポジトリを `git clone` して Chrome で拡張機能をインストールします。[拡張機能のページ](chrome://extensions/) から `パッケージ化されていない拡張機能を読み込む` ボタンでインストールします。
5. 拡張機能のオプション画面で、上記の手順で作成した Integraton Token と Database ID (上記で作成した Database の URL から Database ID をコピーします) を入力して登録します。
   ![](https://user-images.githubusercontent.com/236607/120336753-9e32b500-c32d-11eb-9885-c900ab9a5c3d.png)
6. Amazon.co.jp の本の詳細ページで拡張機能を開くと、書誌情報を取得します。登録ボタンを押下すると Notion の該当 Database に本の情報が登録されます。

## おまけ

iOS で同様の仕組みを作る方法: [iOS のショートカットから Safari で開いているページの情報を Notion に登録する](https://zenn.dev/hikarock/articles/abd514aa7abfcc)
