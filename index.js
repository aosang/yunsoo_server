const express = require("express")
const app = express()
const port = 3000

const cors = require("cors");
const routerLogin = require("./router/routerLogin")
const routerWorkorder = require("./router/routerWorkorder")
const routerProfile = require("./router/routerProfile")

// 获取本机IPv4地址的函数
function getLocalIPv4Address() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 跳过内部地址和非IPv4地址
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0'; // 如果没有找到合适的IP，使用0.0.0.0
}

// app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// router
app.use(routerLogin)
app.use(routerWorkorder)
app.use(routerProfile)

const localIP = getLocalIPv4Address();
app.listen(port, localIP, () => {
  console.log(`Server is running on http://${localIP}:${port}`)
})