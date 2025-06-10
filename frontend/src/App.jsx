import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner';
import { Landing } from "./pages/Landing"
import { Login } from "./pages/Login";
import { Register } from './pages/Register';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
