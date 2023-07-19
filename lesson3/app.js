/*
 * @Description: 简单爬虫
 * @FilePath: \nodeDemo\lesson3\app.js
 * @Author: Jamboy
 * @Date: 2023-07-19 11:34:00
 * @LastEditTime: 2023-07-19 13:45:33
 */

const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()

app.get('/', function (req, res, next) {
  superagent.get('https://cnodejs.org/').end(function (err, sres) {
    if (err) return next(err)
    const $ = cheerio.load(sres.text)
    const items = []
    $('#topic_list .topic_title').each(function (idx, element) {
      const $element = $(element)
      items.push({
        title: $element.attr('title'),
        href: $element.attr('href'),
      })
    })

    $('#topic_list .user_avatar img').each(function (idx, element) {
      const $element = $(element)
      items[idx].author = $element.attr('title')
      // items.push({
      //   author: $element.attr('title'),
      // })
    })

    res.send(items)
  })
})

app.listen('3000', function () {
  console.log('app is listening at port 3000')
})
