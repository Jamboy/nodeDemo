/*
 * @Description:
 * @FilePath: \wms_webd:\Work\WebDemo\nodeDemo\hello-world.js
 * @Author: Jamboy
 * @Date: 2023-04-20 14:11:21
 * @LastEditTime: 2023-04-20 14:52:35
 */
const http = require('node:http')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello, World!\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
