import './index.css'
import Authentication_Page from "./Authentication_Page.tsx"
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/auth' Component={Authentication_Page}></Route>
    </Routes>
  )
}

export default App
