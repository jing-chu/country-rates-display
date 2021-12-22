import { useState, useEffect } from 'react';
import CountryInfo from './component/CountryInfo'
import Table from './component/Table'
import Chart from './component/Chart';
import './App.css';
import axios from 'axios'

function App() {

  const [countries, setCountries] = useState(["", ""])
  const [rates, setRates] = useState([])
  const [filterCountry1, setFilterCountry1] = useState('CNY')
  const [filterCountry2, setFilterCountry2] = useState('BRL')
  const [currencyCodes, setCurrencyCodes] = useState([])
  const [visibility, setVisibility] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      const currencyCodes = await axios('http://localhost:3001')
      const currencyCodesArr = []
      for (let i in currencyCodes.data) {
        currencyCodesArr.push(currencyCodes.data[i].currency_code)
      }
      setCurrencyCodes(currencyCodesArr)
    }
    fetchData()
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    const postData = async () => {
      try {
        const countriesResult = await axios.post('http://localhost:3001/countries', {
          currencyCode1: filterCountry1,
          currencyCode2: filterCountry2
        })
        console.log(countriesResult.data)
        setCountries(countriesResult.data)
        const ratesResult = await axios.post('http://localhost:3001/rates', {
          currencyCode1: filterCountry1,
          currencyCode2: filterCountry2
        })
        const newRates = preprocessRates(ratesResult.data)
        setRates(newRates)
        console.log(newRates)
      } catch (err) {
        console.log(err)
      }
    }
    postData()
    setVisibility(true)
    setIsDisabled(false)
  }

  function handleFiterCountry1(e) {
    if (e.target.value === filterCountry2) {
      alert("Please choose a different currency.")
    } else {
      setFilterCountry1(e.target.value)
    }
  }

  function handleFiterCountry2(e) {
    if (e.target.value === filterCountry1) {
      alert("Please choose a different currency.")
    } else {
      setFilterCountry2(e.target.value)
    }
  }

  function preprocessRates(rates) {
    const newRates = rates.map(item => {
      return {
        date: item.date,
        Rate: item[filterCountry2] / item[filterCountry1]
      }
    })
    return newRates
  }

  function handleReset() {
    setFilterCountry1('CNY')
    setFilterCountry2('BRL')
    setIsDisabled(true)
    setVisibility(false)
  }

  const fieldsName = ['Date', 'Rate']  //for Table component

  return (
    <div className="App">
      <h1>Exchange rates and Countries</h1>
      <form className="select-form" onSubmit={handleSubmit}>
        <select value={filterCountry1} onChange={handleFiterCountry1}>
          {currencyCodes.map((field, index) => {
            return <option key={index} value={field}>{field}</option>
          })}
        </select>
        <select value={filterCountry2} onChange={handleFiterCountry2}>
          {currencyCodes.map((field, index) => {
            return <option key={index} value={field}>{field}</option>
          })}
        </select>
        <input type="submit" value='Submit' />
        <input type="button" value="Reset" disabled={isDisabled} onClick={handleReset} />
      </form>
      <hr />
      {visibility ?
        <div className="container-results">
          <div className="country-info">
            <CountryInfo
              country={countries[1]}
            />
            <CountryInfo
              country={countries[0]}
            />
          </div>
          <div className="table-container">
            <p>{filterCountry1} to {filterCountry2} in November 2021</p>
            <Chart data={rates} />
          </div>
        </div> : null
      }
    </div>
  );
}

//<Table data={rates} fieldsName={fieldsName} />

export default App;
