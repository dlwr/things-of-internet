# ToI(Things of Internet)

> インターネットのモノ(Things of Internet,ToI)は、一意に識別可能な「インターネットのページ」が[SUZURI](https://suzuri.jp/)に接続され、API POSTすることにより物質化する仕組みである

> (出展 [Wikipedia 「インターネットのモノ」](https://ja.wikipedia.org/wiki/%E3%83%A2%E3%83%8E%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88))

このリポジトリは、インターネットのページを定期的に[SUZURI](https://suzuri.jp/)に投稿する、いわゆる*SUZURI bot*制作するためのスケルトンです。

例えば、[誰かが書いた日記](https://suzuri.jp/darekagakaita)のようなbotを作ることができます。

### 使用法

#### `app.js` を編集して、以下の定数を変更して下さい

##### `API_KEY`

[SUZURI API](https://suzuri.jp/api/v1)を利用するためのキーです。SUZURIアカウント取得後、 https://suzuri.jp/api/v1/apps で取得できます。

##### `URL`
モノに変えたいURLです。

##### `SELECTOR`
モノにプリントしたい部分のセレクタです。

##### `CRON_TIME`
モノにプリントするスケジュールです。

#### 以下のコマンドを実行してください

```bash
npm install
node app.js
```

### Heroku

Herokuで動かすことができます。

```bash
heroku create
git push heroku master
```

ただし、無料だと一日7時間以上稼働し続けられないなどの制限があるため、少しお金を払う必要があるかもしれないです。

### refs.

[darekagakaita](https://github.com/dlwr/darekagakaita)

[pageres](https://github.com/sindresorhus/pageres)

[SUZURI](https://suzuri.jp)

[誰かが書いた日記](https://suzuri.jp)
