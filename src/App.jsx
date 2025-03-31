// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

// Public Components
import Homepage from "./components/public/homepage";
import Aboutus from "./components/public/Aboutus";
import Event from "./components/public/Event";
import New from "./components/public/New";
import Coming from "./components/public/Coming";
import Number from "./components/public/Number";
import Contact from "./components/public/Contact";
import Footer from "./components/public/Footer";
import Navbar from "./components/public/Navbar";

// Auth Components - ที่ย้ายไปยัง auth/pages แล้ว
import Login from "./components/auth/pages/Login";
import Register from "./components/auth/pages/Register";
import RegisterCPE from "./components/auth/pages/Registercpe";
import ForgotPassword from "./components/auth/pages/ForgotPassword";
import EmailVerification from "./components/auth/pages/EmailVerification";

// Common Components
import Page404 from "./components/common/Page404";
import PopupSuccess from "./components/common/PopupSuccess";

// Private Components
import Homeuser from "./components/private/Homeuser";
import NavbarUser from "./components/private/NavbarUser";
import Newuser from "./components/private/Newuser";
import Newsdetail from "./components/private/Newsdetail";
import CreatePost from "./components/private/CreatePost";
import Footeruser from "./components/private/Footeruser";
import Card from "./components/private/Card";
import Dashboard from "./components/private/Dashboard";
import Table from "./components/private/Table";
import Alumni from "./components/private/Alumni";
import Findmycpe from "./components/private/Findmycpe";
import Editprofile from "./components/private/Editprofile";
import ChatPage from "./components/private/ChatPage";
import { ChatProvider } from "./components/private/ChatContext";
import Editpostmodal from "./components/private/Editpostmodal";

// Admin Components
import Homeadmin from "./components/admin/Homeadmin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminReports from "./components/admin/AdminReports";
import UserManagement from "./components/admin/UserManagement";

// Layout Components
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const PrivateLayout = ({ children }) => {
  return (
    <>
      <NavbarUser />
      {children}
      <Footeruser />
    </>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

// Auth-only layout for login, register pages (no navbar/footer)
const AuthLayout = ({ children }) => {
  return children;
};

const App = () => {
  const [posts, setPosts] = useState([]);

  const handleCreatePost = (newPost) => {
    setPosts((prevPosts) => [
      { ...newPost, id: Date.now() },
      ...prevPosts,
    ]);
  };

  const handleEditPost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={<PublicLayout><Homepage /></PublicLayout>} 
          />
          <Route 
            path="/aboutus" 
            element={<PublicLayout><Aboutus /></PublicLayout>} 
          />
          <Route 
            path="/event" 
            element={<PublicLayout><Event posts={posts} /></PublicLayout>} 
          />
          <Route 
            path="/new" 
            element={<PublicLayout><New posts={posts} /></PublicLayout>} 
          />
          <Route 
            path="/coming" 
            element={<PublicLayout><Coming /></PublicLayout>} 
          />
          <Route 
            path="/number" 
            element={<PublicLayout><Number /></PublicLayout>} 
          />
          <Route 
            path="/contact" 
            element={<PublicLayout><Contact /></PublicLayout>} 
          />
          
          {/* Auth Routes (no navbar/footer) */}
          <Route 
            path="/login" 
            element={<AuthLayout><Login /></AuthLayout>} 
          />
          <Route 
            path="/register" 
            element={<AuthLayout><Register /></AuthLayout>} 
          />
          <Route 
            path="/registercpe" 
            element={<AuthLayout><RegisterCPE /></AuthLayout>} 
          />
          <Route 
            path="/forgotpassword" 
            element={<AuthLayout><ForgotPassword /></AuthLayout>} 
          />
          <Route 
            path="/emailverification" 
            element={<AuthLayout><EmailVerification /></AuthLayout>} 
          />
          <Route 
            path="/success" 
            element={<AuthLayout><PopupSuccess /></AuthLayout>} 
          />

          {/* Private User Routes */}
          <Route 
            path="/homeuser" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Homeuser
                    posts={posts}
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                  />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/newuser" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Newuser
                    posts={posts}
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                  />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/newsdetail" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Newsdetail onUpdatePost={handleEditPost} />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/createpost" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <CreatePost onCreatePost={handleCreatePost} />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/chatpage" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <ChatProvider>
                    <ChatPage />
                  </ChatProvider>
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/editpostmodal" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <ChatProvider>
                    <Editpostmodal />
                  </ChatProvider>
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/alumni" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Alumni />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/card" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Card />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/table" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Table />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/findmycpe" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Findmycpe />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/editprofile" 
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <Editprofile />
                </PrivateLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <Homeadmin />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/admin/reports" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </AdminRoute>
            } 
          />

          <Route 
            path="/admin/management" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <UserManagement/>
                </AdminLayout>
              </AdminRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;