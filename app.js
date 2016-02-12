const Pageres = require('pageres')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const cronJob = require('cron').CronJob
const http = require('http')

const options = {
  selector: 'div.content',
  css: 'div.right {display: none!important;}'
}
const API_KEY = "hogeraccho"

const url = 'http://darekagakaku.herokuapp.com'

var content = ''
var prevContent = ''

function darekagakaita() {
  var chunks = []
  fetch(url)
    .then(res => res.text())
    .then(text => {
      $ = cheerio.load(text)
      content = $('div.content').text().replace(/About \| EditMe$/, '').replace(/^\d{1,4}年\d{1,2}月\d{1,2}日\s*/, '')
      if (content === prevContent || content === '') {
        console.log ('変わってなかった')
        return Promise.reject()
      }
      return new Pageres(options)
        .src('darekagakaku.herokuapp.com', ['1920x1080'])
        .run()
    })
    .then(result => {
      return new Promise((resolve, reject) => {
        result[0].on('data', data => {
          chunks.push(data)
        })
        result[0].on('end', () => {
          var result = Buffer.concat(chunks)
          resolve('data:image/png;base64,' + result.toString('base64'))
        })
      })
    })
    .then(img => {
      var date = new Date
      var itemId = [1,2,3,5,6,7,9][Math.floor(Math.random() * 7)]
      var product = {
        itemId: itemId,
        published: true,
        resizeMode: 'contain',
        exemplaryAngle: 'left'
      }
      if (itemId === 3) {
        product.exemplaryAngle = 'left'
      }
      var params = {
        texture: img,
        title: date.getFullYear() + '年' + ('0' + (date.getMonth() + 1)).slice(-2) + '月' + date.getDate() + '日' + ('0' + date.getHours()).slice(-2) + '時' + ('0' + date.getMinutes()).slice(-2) + '分',
        description: content,
        products: [ product ]
      }
      return fetch('https://suzuri.jp/api/v1/materials', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY
        },
        method: 'POST',
        body: JSON.stringify(params)
      })
    })
    .then(res => {
      console.log('変わってたから作った')
      console.log(content)
      prevContent = content
      return res.text()
    })
    .then(text => {console.log(text)})
}

var job = new cronJob({
  cronTime: '0,30 * * * * *',
  onTick: darekagakaita,
  start: true
});

job.start();

http.createServer((request, response) => {
  if (request.url === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    response.end();
    console.log('favicon requested');
    return;
  }
  response.writeHead(200, {'Content-Type': 'text/plain'})
  response.end(`誰かが書いた\n${prevContent}\n`)
}).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080)
