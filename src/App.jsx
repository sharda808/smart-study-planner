
import './App.css'
import {Routes,Route} from "react-router-dom"
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Signup from './components/Signup'
import Home from './pages/Home'
import Header from './components/Header'


function App() {


  return (
   <>
<Header />
    <Routes>
 <Route path = "/" element = {<Home />} />

      <Route path = "/login" element ={<Login />} />
 <Route path = "/signup" element ={<Signup />} />   
<Route path="/dashboard" element = {<Dashboard />} />
<Route path = "/tasks" element = {<Tasks/>} />
</Routes>
</>

  )
}

export default App
