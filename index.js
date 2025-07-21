const express = require("express")
const app = express()
const port = 3000

const cors = require("cors");
const routerLogin = require("./router/routerLogin")
const routerWorkorder = require("./router/routerWorkorder")
// app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// router
app.use(routerLogin)
app.use(routerWorkorder)

app.listen(port, '192.168.8.5', () => {
  console.log(`Server is running on port ${port}`)
})