import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import ProductDetails from "./pages/public/ProductDetails";
import CategoryMountain from "./pages/public/CategoryMountain";
import CategoryUrban from "./pages/public/CategoryUrban";
import CategoryElectric from "./pages/public/CategoryElectric";
import CategoryKids from "./pages/public/CategoryKids";
import CategoryParts from "./pages/public/CategoryParts";
import CategoryAccessories from "./pages/public/CategoryAccessories";
import CategoryApparel from "./pages/public/CategoryApparel";
import CategoryDeals from "./pages/public/CategoryDeals";
import Login from "./pages/admin/Login";
import Register from "./pages/public/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductsList from "./pages/admin/ProductsList";
import ProductForm from "./pages/admin/ProductForm";
import InventoryOverview from "./pages/admin/InventoryOverview";
import StockMovements from "./pages/admin/StockMovements";
import StockAdjust from "./pages/admin/StockAdjust";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetailsPage from "./pages/admin/OrderDetailsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import ToastProvider from "./components/ToastProvider";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastProvider />
          <div
            className="App"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <main
              style={{ flex: 1 }}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/register" element={<Register />} />

                {/* Category Routes */}
                <Route path="/category/mountain" element={<CategoryMountain />} />
                <Route path="/category/urban" element={<CategoryUrban />} />
                <Route path="/category/electric" element={<CategoryElectric />} />
                <Route path="/category/kids" element={<CategoryKids />} />
                <Route path="/category/parts" element={<CategoryParts />} />
                <Route
                  path="/category/accessories"
                  element={<CategoryAccessories />}
                />
                <Route path="/category/apparel" element={<CategoryApparel />} />
                <Route path="/category/deals" element={<CategoryDeals />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute>
                      <ProductsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/new"
                  element={
                    <ProtectedRoute>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/:id/edit"
                  element={
                    <ProtectedRoute>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/inventory"
                  element={
                    <ProtectedRoute>
                      <InventoryOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/inventory/movements"
                  element={
                    <ProtectedRoute>
                      <StockMovements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/inventory/adjust/:id"
                  element={
                    <ProtectedRoute>
                      <StockAdjust />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
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
