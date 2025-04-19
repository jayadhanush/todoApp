import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoComponent from './pages/TodoComponent.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TodoComponent/>
    </>
  )
}

export default App
