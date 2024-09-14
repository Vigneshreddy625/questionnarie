import { useState } from 'react'
import './App.css'
import CustomerSurvey from './components/Survey'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CustomerSurvey/>
    </>
  )
}

export default App
