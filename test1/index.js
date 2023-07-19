/*
 * @Description: 
 * @Author: Jamboy
 * @Date: 2021-08-24 18:31:23
 * @LastEditTime: 2021-08-24 18:34:20
 */
const http = require('http')

const server = http.createServer((req, res) => {
  const url = req.url
  const path = url.split('?')[0]
  res.end(path)
})

server.listen(3000)