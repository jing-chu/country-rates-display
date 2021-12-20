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

const getRatesfromFixer = async (day) => {
  try {
    return await axios.get(`http://data.fixer.io/api/2021-11-${day}?access_key=602925509d64f5fecce3058df69fe6ab&symbols=AUD,BRL,CNY,GBP,USD`)
    //console.log(resp.data)
  } catch (err) {
    console.error(err)
  }
}

const getCountriesfromLayer = async () => {
  try {
    return await axios.get('http://api.countrylayer.com/v2/all?access_key=22b078bafdfca6a157d08096e74ecbb8')
    //quert all countries info
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  ////Query data from FIXER
  // let day = 1
  // for (day = 1; day <= 30; day++) {
  //   let resp = []
  //   if (day <= 9) {
  //     resp = await getRatesfromFixer("0" + day)
  //   } else {
  //     resp = await getRatesfromFixer(day)
  //   }
  //   console.log(resp.data)
  //   const result = resp.data
  //   const sqlInsert = 'INSERT INTO eurbase_table (date, AUD, BRL, CNY, GBP, USD) VALUES (?, ?, ?, ?, ?, ?);'
  //   db.query(sqlInsert, [result.date, result.rates.AUD, result.rates.BRL, result.rates.CNY, result.rates.GBP, result.rates.USD], (err, result) => {
  //     console.log(err)
  //   })
  // }

  //Query data from COUNTRYLAYER
  const resp = await getCountriesfromLayer()
  const countries = resp.data.filter(country => (
    country.name === 'Australia' ||
    country.name === 'Brazil' ||
    country.name === 'China' ||
    country.name === 'United Kingdom of Great Britain and Northern Ireland' ||
    country.name === 'United States of America'
  ))
  console.log(countries)

  for (let i = 0; i < countries.length; i++) {
    const sqlInsert = 'INSERT INTO country_info (country_name, country_code, calling_code, capital, region) VALUES (?, ?, ?, ?, ?);'
    db.query(sqlInsert, [countries[i].name, countries[i].alpha3Code, countries[i].callingCodes[0], countries[i].capital, countries[i].region], (err, result) => {
      console.log(err)
    })
  }

}



app.get('/', (req, res) => {

  main()
  res.send("item is inserted.")

})

app.listen(port, () => {
  console.log(`country info app listening at http://localhost:${port}`)
})

