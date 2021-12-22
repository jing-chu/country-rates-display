const express = require('express')
const cors = require('cors')
const axios = require('axios')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'countryinfo'
})

const getRatesfromFixer = async (day) => {
  try {
    return await axios.get(`http://data.fixer.io/api/2021-11-${day}?access_key=602925509d64f5fecce3058df69fe6ab&symbols=AUD,BRL,CNY,GBP,USD`)
  } catch (err) {
    console.error(err)
  }
}

const getCountriesfromLayer = async () => {
  try {
    //quert all countries info
    return await axios.get('http://api.countrylayer.com/v2/all?access_key=22b078bafdfca6a157d08096e74ecbb8')
  } catch (err) {
    console.error(err)
  }
}

app.get('/', (req, res) => {
  res.send()
})

//Save data to country_info table
app.get('/api/countries', (req, res) => {
  const saveCountriesToDB = async () => {
    const currency_code = {
      'China': 'CNY',
      'Brazil': 'BRL',
      'Australia': 'AUD',
      'United Kingdom of Great Britain and Northern Ireland': 'GBP',
      'United States of America': 'USD'
    }
    try {
      const resp = await getCountriesfromLayer()
      const countries = resp.data.filter(country => (
        country.name === 'Australia' ||
        country.name === 'Brazil' ||
        country.name === 'China' ||
        country.name === 'United Kingdom of Great Britain and Northern Ireland' ||
        country.name === 'United States of America'
      ))
      for (let i = 0; i < countries.length; i++) {
        const sqlInsert = 'INSERT INTO country_info (country_name, country_code, calling_code, capital, region, currency_code) VALUES (?, ?, ?, ?, ?, ?);'
        db.query(sqlInsert, [countries[i].name, countries[i].alpha3Code, countries[i].callingCodes[0], countries[i].capital, countries[i].region, currency_code[countries[i].name]], (err, result) => {
          console.log(err)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  //saveCountriesToDB()
})

//Save data to eurbase_table table
app.get('/api/rates', (req, res) => {
  const saveRatesToDB = async () => {
    try {
      let day = 1
      for (day = 1; day <= 30; day++) {
        let resp = []
        if (day <= 9) {
          resp = await getRatesfromFixer("0" + day)
        } else {
          resp = await getRatesfromFixer(day)
        }
        console.log(resp.data)
        const result = resp.data
        const sqlInsert = 'INSERT INTO eurbase_table (date, AUD, BRL, CNY, GBP, USD) VALUES (?, ?, ?, ?, ?, ?);'
        db.query(sqlInsert, [result.date, result.rates.AUD, result.rates.BRL, result.rates.CNY, result.rates.GBP, result.rates.USD], (err, result) => {
          console.log(err)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  //saveRatesToDB()
})

//Select data from mysql COUNTRY_INFO table
app.post('/countries', (req, res) => {
  const country_name1 = req.body.country_name1
  const country_name2 = req.body.country_name2
  const sqlSelect = `SELECT * FROM country_info WHERE country_name='${country_name1}' OR country_name='${country_name2}';`
  db.query(sqlSelect, (err, result) => {
    res.send(result)
    console.log(err)
  })
})

//Select data from mysql EURBASE_TABLE table
app.post('/rates', (req, res) => {
  let country_name1 = req.body.country_name1
  let country_name2 = req.body.country_name2
  const country_currency = {
    'China': 'CNY',
    'Brazil': 'BRL',
    'Australia': 'AUD',
    'United Kingdom of Great Britain and Northern Ireland': 'GBP',
    'United States of America': 'USD'
  }
  for (const key in country_currency) {
    if (country_name1 === key) {
      country_name1 = country_currency[country_name1]
    }
    if (country_name2 === key) {
      country_name2 = country_currency[country_name2]
    }
  }
  const sqlSelect = `SELECT date, ${country_name1}, ${country_name2} FROM eurbase_table;`
  db.query(sqlSelect, (err, result) => {
    res.send(result)
    console.log(err)
  })
})

app.listen(port, () => {
  console.log(`country info app listening at http://localhost:${port}`)
})

