const express = require("express")
const cors = require("cors")
const path = require("path")
const feedRoutes = require("./routes/feed")
const sequelize = require("./util/database")
const app = express()

app.use(cors())
app.use(express.json())
app.use("images", express.static(path.join(__dirname, "images")))

app.use((req, res, next) => {
  //postavljanje dozvola o ukidanju cors-8,dozvola klijentu da da postavlja konteknt type i autorizaciju i da salje metode (post,put,patch i delete)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Acces-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  next()
})

app.use("/feed", feedRoutes)
app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode
  const message = error.message
  res.status(status).json({ message: message })
})

sequelize
  .sync()
  .then((res) => {
    app.listen(8080, () => {
      console.log("Server is running on port 8080")
    })
  })
  .catch((err) => {
    console.log(err)
  })
