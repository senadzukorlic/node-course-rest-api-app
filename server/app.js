const express = require("express")
const bodyParser = require("body-parser")
const feedRoutes = require("./routes/feed")

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  //postavljanje dozvola o ukidanju cors-8,dozvola klijentu da da postavlja konteknt type i autorizaciju i da salje metode (post,put,patch i delete)
  res.setHeader("Acces-Control-Allow-Origin", "*")
  res.setHeader(
    "Acces-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  )
  res.setHeader("Acces-Control-Allow-Headers", "Content-Type,Authorization")
  next()
})

app.use("/feed", feedRoutes)

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})
