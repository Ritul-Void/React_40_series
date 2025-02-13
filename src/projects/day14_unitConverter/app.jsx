import { useState } from "react"
import "./App.css"

export default function App() {
  const units = {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701
  }

  const [from, setFrom] = useState("meters")
  const [to, setTo] = useState("kilometers")
  const [value, setValue] = useState("")
  const [result, setResult] = useState("")

  const convert = (v, f, t) => {
    if (!v) return setResult("")
    const base = parseFloat(v) * units[f]
    const converted = base / units[t]
    setResult(converted)
  }

  return (
    <div className="container">
      <h1>Unit Converter</h1>
      <div className="row">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => {
            setValue(e.target.value)
            convert(e.target.value, from, to)
          }}
          placeholder="Enter value"
        />
        <select 
          value={from} 
          onChange={(e) => {
            setFrom(e.target.value)
            convert(value, e.target.value, to)
          }}
        >
          {Object.keys(units).map(u => <option key={u}>{u}</option>)}
        </select>
      </div>

      <div className="row">
        <input 
          type="text" 
          value={result} 
          readOnly 
          placeholder="Result"
        />
        <select 
          value={to} 
          onChange={(e) => {
            setTo(e.target.value)
            convert(value, from, e.target.value)
          }}
        >
          {Object.keys(units).map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  )
}
