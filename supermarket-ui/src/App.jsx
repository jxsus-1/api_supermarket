import { useState } from 'react';
import './App.css'

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

import Dashboard from './components/Dashboard'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'

// Renombramos para que concuerde con tu API
import CategoryList from './components/CategoryList' 
import ProductList from './components/ProductList'       

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta por defecto que redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path='/login'
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/signup'
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
            />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Category = CatalogType */}
            <Route
              path='/categories'
              element={
                <ProtectedRoute>
                  <CategoryList />
                </ProtectedRoute>
              }
            />

            {/* Product = Catalog */}
            <Route
              path='/products'
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
