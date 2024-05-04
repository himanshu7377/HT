import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './component/login';
import Navbar from './component/Navbar';
import Dashboard from './component/Dashboard';
import CreateEmployee from './component/CreateEmployee';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import List from './component/List';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar /> {/* Navbar component is always rendered */}
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/createemployees" element={<CreateEmployee />} />
          <Route exact path="/employees" element={<List />} />
        </Routes>
        <ToastContainer /> 
      </BrowserRouter>
    </div>
  );
}

export default App;
