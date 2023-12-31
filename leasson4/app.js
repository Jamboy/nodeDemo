const express = require('express')
var async = require('async')
const app = express()

var eventproxy = require('eventproxy')
var superagent = require('superagent')
var cheerio = require('cheerio')
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url')

var cnodeUrl = 'https://cnodejs.org/'

// app.get('/', function (req, appRes) {
//   var topicsList = []
//   superagent.get(cnodeUrl).end(function (err, res) {
//     if (err) {
//       return console.error(err)
//     }
//     var topicUrls = []
//     var $ = cheerio.load(res.text)
//     // 获取首页所有的链接
//     $('#topic_list .topic_title').each(function (idx, element) {
//       var $element = $(element)
//       // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
//       // 我们用 url.resolve 来自动推断出完整 url，变成
//       // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
//       // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
//       var href = url.resolve(cnodeUrl, $element.attr('href'))
//       topicUrls.push(href)
//     })

//     console.log(topicUrls)
//     const ep = new eventproxy()
//     ep.after('topic_html', topicUrls.length, function (topics) {
//       console.log('topics: ', topics)
//       // 开始行动
//       topicsList = topics.map(function (topicPair) {
//         // 接下来都是 jquery 的用法了
//         var topicUrl = topicPair[0]
//         var topicHtml = topicPair[1]
//         var $ = cheerio.load(topicHtml)
//         return {
//           title: $('.topic_full_title').text().trim(),
//           href: topicUrl,
//           comment1: $('.reply_content').eq(0).text().trim(),
//         }
//       })

//       console.log('final:')
//       console.log(topicsList)
//       appRes.send(topicsList)
//     })

//     topicUrls.forEach(function (topicUrl) {
//       superagent.get(topicUrl).end(function (err, res) {
//         console.log('fetch ' + topicUrl + ' successful')
//         ep.emit('topic_html', [topicUrl, res.text])
//       })
//     })
//   })
// })

app.get('/', function (req, appRes) {
  var topicsList = []
  superagent.get(cnodeUrl).end(function (err, res) {
    if (err) {
      return console.error(err)
    }
    var topicUrls = []
    var $ = cheerio.load(res.text)
    // 获取首页所有的链接
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element)
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      var href = url.resolve(cnodeUrl, $element.attr('href'))
      topicUrls.push(href)
    })

    var concurrencyCount = 0
    const fetchUrl = function (url, callback) {
      concurrencyCount++
      superagent.get(url).end(function (err, res) {
        concurrencyCount--
        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url)
        callback(null, [url, res.text])
      })
    }

    async.mapLimit(
      topicUrls,
      3,
      function (url, callback) {
        fetchUrl(url, callback)
      },
      function (err, result) {
        // console.log('final:')
        // console.log(result)
        topicsList = result.map(function (topicPair) {
          // 接下来都是 jquery 的用法了
          var topicUrl = topicPair[0]
          var topicHtml = topicPair[1]
          var $ = cheerio.load(topicHtml)
          return {
            title: $('.topic_full_title').text().trim(),
            href: topicUrl,
            comment1: $('.reply_content').eq(0).text().trim(),
          }
        })
        appRes.send(topicsList)
      }
    )
  })
})

app.listen(3000, function () {
  console.log('3000: ', 3000)
})
