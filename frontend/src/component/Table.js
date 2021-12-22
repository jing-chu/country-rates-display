import "../App.css"

function Header({ headerData }) {
  return headerData.map((key) => {
    return <th key={key}>{key.toUpperCase()}</th>
  })
}

function Row({ objRow, fieldsName }) {
  return fieldsName.map((field, index) => {
    if (objRow[field] === undefined) {
      return <td key={index}></td>
    } else {
      return <td key={index}>{objRow[field]}</td>
    }
  })
}

function Body({ bodyData, fieldsName }) {
  return bodyData.map((row, index) => {
    return <tr key={index}><Row key={index} objRow={row} fieldsName={fieldsName} /></tr>
  })
}

export default function Table({ data, fieldsName }) {
  return (
    <>
      <table className="table">
        <thead>
          <Header headerData={fieldsName} />
        </thead>
        <tbody>
          <Body bodyData={data} fieldsName={fieldsName} />
        </tbody>
      </table>
    </>
  )
}
