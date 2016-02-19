const Pageres = require('pageres')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const cronJob = require('cron').CronJob
const http = require('http')

// get from https://suzuri.jp/developer/apps
const API_KEY   = "YOUR_SUZURI_API_KEY"
// page url you want to archive
const URL       = 'http://page.to.archive/page/to/archive'
// target DOM to archive. (if you want to all of page, set to 'body')
const SELECTOR  = '#content.you-want-to-archive'
// cron time. '0 0 0 * * *' is means that this app archive target page on 00:00 every day
const CRON_TIME = '0 0 0 * * *'

const options = {
  selector: SELECTOR
}

var content = ''
var prevContent = ''

function archive() {
  var chunks = []
  fetch(URL)
    .then(res => res.text())
    .then(text => {
      $ = cheerio.load(text)
      content = $(SELECTOR).html()
      if (content === prevContent || content === '') {
        return Promise.reject()
      }
      return new Pageres(options)
        .src(URL, ['1920x1080'])
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
      prevContent = content
      return res.text()
    })
    .then(text => {console.log(text)})
}

var job = new cronJob({
  cronTime: CRON_TIME,
  onTick: archive,
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
  response.end(`${prevContent}\n`)
}).listen(process.env.PORT || 8080)
