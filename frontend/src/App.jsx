import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { Landing } from "./pages/Landing"
import { Login } from "./pages/Login";
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { BookDetails } from './pages/BookDetails';
import { Search } from './pages/Search';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllUsers } from './pages/admin/AllUsers';
import { AccountRequests } from './pages/admin/AccountRequests';
import { AllBooks } from './pages/admin/AllBooks';
import { BorrowRequests } from './pages/admin/BorrowRequests';
import { CreateBookDetails } from './pages/admin/CreateBookDetails';

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
            <ProtectedRoute allowedRoles={["student"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookdetails/:bookId"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-books"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllBooks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/borrow-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BorrowRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AccountRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-book-details"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateBookDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
