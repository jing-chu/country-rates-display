import "../App.css"

export default function CountryInfo({ country }) {
  return (
    <>
      <div className="card">
        <p><b>Country Name: </b><span>{country.country_name}</span></p>
        <p><b>Country Code: </b><span>{country.country_code}</span></p>
        <p><b>Calling Code: </b><span>{country.calling_code}</span></p>
        <p><b>Currency Code: </b><span>{country.currency_code}</span></p>
        <p><b>Capital: </b><span>{country.capital}</span></p>
        <p><b>Region: </b><span>{country.region}</span></p>
      </div>
    </>
  )
}