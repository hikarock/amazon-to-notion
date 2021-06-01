# amazon-to-notion
Amazon.co.jp の書誌情報を Notion の DB に登録する Chrome 拡張機能です。

## 動作環境
Chrome 88 以降

## 使い方
1. [Notion API](https://www.notion.so/my-integrations) で integration を作成します。
![](https://user-images.githubusercontent.com/236607/120334613-bc97b100-c32b-11eb-87c9-d4e2c59893b1.png)
2. Notion の workspace に Database を作成して integration の権限を設定します。Database のページにはプロパティとして `Authors` (Text) と `Media Type` (Multi-select) を追加してください。
![](https://user-images.githubusercontent.com/236607/120335463-73942c80-c32c-11eb-8bee-72b7abbaf72e.png)
3. 当リポジトリを `git clone` して Chrome で拡張機能をインストールします。[拡張機能のページ](chrome://extensions/) から `パッケージ化されていない拡張機能を読み込む` ボタンでインストールします。
4. 拡張機能のオプション画面で、上記の手順で作成した Integraton Token と Database ID (上記で作成した Database の URL から Database ID をコピーします) を入力して登録します。 
![](https://user-images.githubusercontent.com/236607/120336753-9e32b500-c32d-11eb-9885-c900ab9a5c3d.png)
5. Amazon.co.jp の本の詳細ページで拡張機能を開くと、書誌情報を取得します。登録ボタンを押下すると Notion の該当 Database に本の情報が登録されます。
