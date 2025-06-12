import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {ProtectedRoute} from './auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { Landing } from "./pages/Landing"
import { Login } from "./pages/Login";
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { BookDetails } from './pages/BookDetails';
import { Search } from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookdetails/:bookId"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
