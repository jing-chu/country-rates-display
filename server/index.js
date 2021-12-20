const express = require('express')
const axios = require('axios')
const mysql = require('mysql')
const app = express()
const port = 3001

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'countryinfo'
})

const sendFixerGetRequest = async (day) => {
  try {
    return await axios.get(`http://data.fixer.io/api/2021-11-${day}?access_key=602925509d64f5fecce3058df69fe6ab&symbols=AUD,BRL,CNY,GBP,USD`)
    //console.log(resp.data)
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {

  const resp = await sendFixerGetRequest(24)
  console.log(resp.data)
  const result = resp.data
  const sqlInsert = 'INSERT INTO eurbase_table (date, AUD, BRL, CNY, GBP, USD) VALUES (?, ?, ?, ?, ?, ?);'
  db.query(sqlInsert, [result.date, result.rates.AUD, result.rates.BRL, result.rates.CNY, result.rates.GBP, result.rates.USD], (err, result) => {
    console.log(err)
  })


}



app.get('/', (req, res) => {
  // const sqlInsert = "INSERT INTO country_info (country_name, country_code, calling_code, capital, region) VALUES ('Belgium', 'BEL', '32', 'Brussels', 'Europe');"
  main()



  // let day = 1
  // for (day = 1; day <= 30; day++) {
  //   const result = sendFixerGetRequest(day)
  //   const sqlInsert = `INSERT INTO country_info (date, AUD, BRL, CNY, GBP, USD) VALUES (${result.date}, ${result.rates.AUD}, ${result.rates.BRL}, ${result.rates.CNY}, ${result.rates.GBP}, ${result.rates.USD});`
  //   db.query(sqlInsert, (err, result) => {
  //     console.log(err)
  //   })
  // }


  res.send("item is inserted.")

})

app.listen(port, () => {
  console.log(`country info app listening at http://localhost:${port}`)
})

