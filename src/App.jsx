import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuthContext } from "./context/auth_context"

import ProtectedRoute from "./components/ProtectedRoute";

// Public Components
import Homepage from "./components/public/Homepage";

import New from "./components/public/New";
import Navbar from "./components/Navbar";

import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import RegisterUser from "./pages/public/RegisterUser";
import RegisterCPE from "./pages/public/RegisterCPE";
import RequestOTR from "./pages/public/RequestOTR";

import Page404 from "./components/common/Page404";

import PasswordReset from "./pages/public/PasswordReset";
import ChangeEmail from "./pages/private/ChangeEmail"
import ForgotPassword from "./pages/common/ForgotPassword";

import Newsdetail from "./pages/common/NewsDetail";
// Private Components
import Homeuser from "./components/private/Homeuser";
import Newuser from "./components/private/Newuser";
import CreatePost from "./components/private/CreatePost";

import Footer from "./components/Footer";

import Alumni from "./pages/private/Alumni";
import Editprofile from "./pages/private/EditProfile";
import ChatPage from "./components/private/ChatPage";
import { ChatProvider } from "./components/private/ChatContext";

// import Editpostmodal from "./components/private/Editpostmodal";

// Admin Components
import Homeadmin from "./components/admin/Homeadmin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminReports from "./components/admin/AdminReports";
import UserManagement from "./components/admin/UserManagement";

const AdminLayout = ({ children}) => {
  return (
    <>
      <AdminNavbar/>
        {children}
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar/>
        {children}
      <Footer/>
    </>
  );
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const { isAuthenticated, isLoading } = useAuthContext();

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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Homepage/></Layout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/registry" element={<Register />} />
          <Route path="/registryUser" element={<RegisterUser/>} />
          <Route path="/registryCPE" element={<RegisterCPE/>} />
          <Route path="/requestOTR" element={<RequestOTR/>} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<ChangeEmail />} />
          <Route path="/reset_password" element={<PasswordReset />} />

          {/* Private Routes */}
          <Route path="/homeuser" element={
            <ProtectedRoute element={
              <Layout>
                <Homeuser
                  posts={posts}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </Layout>
              }/>
          } />
          <Route path="/newsuser" element={
            <ProtectedRoute element={
              <Layout>
                <Newuser
                  posts={posts}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </Layout>
              }/>
          }/>
          <Route path="/news/:post_id" element={
            <Layout>
              <Newsdetail onUpdatePost={handleEditPost} key={isAuthenticated ? "auth" : "guest"}/>
            </Layout>
          } />
          <Route path="/createpost" element={
            <ProtectedRoute element={
              <Layout>
                <CreatePost onCreatePost={handleCreatePost} />
              </Layout>
            }/>
          } />
          <Route path="/chatpage" element={
            <ProtectedRoute element={
              <Layout>
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              </Layout>
            }/>
          } />
          <Route path="/alumni" element={
            <ProtectedRoute element={
              <Layout>
                <Alumni />
              </Layout>
            }/>
          } />
          <Route path="/editprofile" element={
            <ProtectedRoute element={
              <Layout>
                <Editprofile />
              </Layout>
            }/>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin" element={
              <AdminLayout>
                <Homeadmin />
              </AdminLayout>
            }/>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }/>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="admin" element={
              <AdminLayout>
                <AdminReports />
              </AdminLayout>
            }/>
          } />
          <Route path="/admin/management" element={
            <ProtectedRoute requiredRole="admin" element={
              <AdminLayout>
                <UserManagement/>
              </AdminLayout>
            }/>
          } />
          {/* 404 Route */}
          <Route path="*" element={<Page404 />} />
        </Routes>
    </Router>
  );
};

export default App;
