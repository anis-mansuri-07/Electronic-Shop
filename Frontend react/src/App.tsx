import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProductCreate from "./pages/admin/ProductCreate";
import AdminProductEdit from "./pages/admin/ProductEdit";
import ProductsList from "./pages/admin/ProductsList";
import UsersList from "./pages/admin/UsersList";
import ManageAdmins from "./pages/admin/ManageAdmins";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminCategoryCreate from "./pages/admin/CategoryCreate";
import CategoriesList from "./pages/admin/CategoriesList";
import CategoryEdit from "./pages/admin/CategoryEdit";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";
import RoleRoute from "./utils/RoleRoute";
import DebugAuth from "./components/DebugAuth";
import { Role } from "./types/auth";

function App() {
  return (
    <Routes>
      {/* Debug Route - Temporary */}
      <Route path="/debug-auth" element={<DebugAuth />} />

      {/* Auth routes - redirect if authenticated */}
      <Route element={<ProtectedRoute requireAuth={false} />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Public routes - accessible to all except admin */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Protected user routes */}
      <Route element={<ProtectedRoute requireAuth={true} />}>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_USER]}>
              <Checkout />
            </RoleRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_USER]}>
              <OrderHistory />
            </RoleRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_USER]}>
              <OrderDetails />
            </RoleRoute>
          }
        />
        <Route
          path="/payment-success/:orderId"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_USER]}>
              <PaymentSuccess />
            </RoleRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute requireAuth={true} />}>
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <CategoriesList />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/products/create"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminProductCreate />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminProductEdit />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <ProductsList />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/categories/create"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminCategoryCreate />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/categories/:id/edit"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <CategoryEdit />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <UsersList />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/manage-admins"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_SUPER_ADMIN]}>
              <ManageAdmins />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminOrders />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/orders/:orderId"
          element={
            <RoleRoute allowedRoles={[Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]}>
              <AdminOrderDetails />
            </RoleRoute>
          }
        />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
