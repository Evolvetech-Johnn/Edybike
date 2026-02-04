import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import ProductDetails from './pages/public/ProductDetails';
import CategoryMountain from './pages/public/CategoryMountain';
import CategoryUrban from './pages/public/CategoryUrban';
import CategoryElectric from './pages/public/CategoryElectric';
import CategoryKids from './pages/public/CategoryKids';
import CategoryParts from './pages/public/CategoryParts';
import CategoryAccessories from './pages/public/CategoryAccessories';
import CategoryApparel from './pages/public/CategoryApparel';
import CategoryDeals from './pages/public/CategoryDeals';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <Header />
            <main className="container" style={{ padding: '2rem 1rem', flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                
                {/* Category Routes */}
                <Route path="/bikes/mountain" element={<CategoryMountain />} />
                <Route path="/bikes/urban" element={<CategoryUrban />} />
                <Route path="/bikes/electric" element={<CategoryElectric />} />
                <Route path="/bikes/kids" element={<CategoryKids />} />
                <Route path="/parts" element={<CategoryParts />} />
                <Route path="/accessories" element={<CategoryAccessories />} />
                <Route path="/apparel" element={<CategoryApparel />} />
                <Route path="/deals" element={<CategoryDeals />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* Catch all - Redirect to Home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <Cart />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
