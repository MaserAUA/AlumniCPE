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
import Aboutus from "./components/public/Aboutus";
import Event from "./components/public/Event";

import New from "./components/public/New";

import Coming from "./components/public/Coming";
import Number from "./components/public/Number";
import Contact from "./components/public/Contact";
import Footer from "./components/public/Footer";

import Navbar from "./components/public/Navbar";
import NavbarUser from "./components/NavbarUser";
// import NavbarUser from "./components/private/NavbarUser";

import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import RegisterUser from "./pages/public/RegisterUser";
import RegisterCPE from "./pages/public/RegisterCPE";
import RequestOTR from "./pages/public/RequestOTR";

import Page404 from "./components/common/Page404";

import PasswordReset from "./pages/public/PasswordReset";
import ChangeEmail from "./pages/private/ChangeEmail"
// import ForgotPassword from "./components/pages/ForgotPassword";
import ForgotPassword from "./pages/common/ForgotPassword";
import EmailVerification from "./components/pages/EmailVerification";

import Newsdetail from "./pages/common/NewsDetail";

// Private Components
import Homeuser from "./components/private/Homeuser";
import Newuser from "./components/private/Newuser";
import CreatePost from "./components/private/CreatePost";
import Footeruser from "./components/private/Footeruser";

// import Card from "./components/Alumni/Card";
// import Dashboard from "./components/Alumni/Dashboard";
// import Table from "./components/Alumni/Table";
// import Findmycpe from "./components/Alumni/Findmycpe";

import Alumni from "./pages/private/Alumni";
// import Editprofile from "./components/private/Editprofile";
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

// Create a function to check if user is authenticated
const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();
  
  // Return if authenticated, otherwise redirect to login
  if (!isLoading){
    return isAuthenticated ? true : <Navigate to="/login" state={{ from: location }} replace />;
  }
};

// Create a function to check if user is admin
const useRequireAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuthContext();
  const location = useLocation();
  
  // Check if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin
  if (!isAdmin) {
    return <Navigate to="/homeuser" state={{ from: location }} replace />;
  }
  
  return true;
};

// Layout Components
const PrivateLayout = ({ children }) => {
  const auth = useRequireAuth();
  
  // If not authenticated, auth will be a Navigate component
  if (auth !== true) return auth;

  return (
    <>
      <NavbarUser />
      {children}
      <Footeruser />
    </>
  );
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
 // const auth = useRequireAdmin();
  
  // If not admin, auth will be a Navigate component
 // if (auth !== true) return auth;

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  
  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
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
          <Route path="/" element={<PublicLayout><Homepage /></PublicLayout>} />
          <Route path="/aboutus" element={<PublicLayout><Aboutus /></PublicLayout>} />
          <Route path="/event" element={<PublicLayout><Event posts={posts} /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><New posts={posts} /></PublicLayout>} />
          <Route path="/coming" element={<PublicLayout><Coming /></PublicLayout>} />
          <Route path="/number" element={<PublicLayout><Number /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registry" element={<Register />} />
          <Route path="/registryUser" element={<RegisterUser/>} />
          <Route path="/registryCPE" element={<RegisterCPE/>} />
          <Route path="/requestOTR" element={<RequestOTR/>} />

          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/emailverification" element={<EmailVerification />} />
          <Route path="/verify-email" element={<ChangeEmail />} />

          <Route path="/reset_password" element={<PasswordReset />} />

          {/* Private Routes */}
          <Route path="/homeuser" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Homeuser
                  posts={posts}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </PrivateLayout>
              }/>
          } />
          <Route path="/newsuser" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Newuser
                  posts={posts}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              </PrivateLayout>
              }/>
          } />
          <Route path="/news/:post_id" element={
          <>
            <NavbarUser/>
              <Newsdetail onUpdatePost={handleEditPost} key={isAuthenticated ? "auth" : "guest"}/>
            <Footeruser/>
          </>
          } />
          <Route path="/createpost" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <CreatePost onCreatePost={handleCreatePost} />
              </PrivateLayout>
            }/>
          } />
          <Route path="/chatpage" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              </PrivateLayout>
            }/>
          } />
          <Route path="/alumni" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Alumni />
              </PrivateLayout>
            }/>
          } />
        {
          // <Route path="/card" element={
          //   <ProtectedRoute element={
          //     <PrivateLayout>
          //       <Card />
          //     </PrivateLayout>
          //   }/>
          // } />
          // <Route path="/dashboard" element={
          //   <ProtectedRoute element={
          //     <PrivateLayout>
          //       <Dashboard />
          //     </PrivateLayout>
          //   }/>
          // } />
          // <Route path="/table" element={
          //   <ProtectedRoute element={
          //     <PrivateLayout>
          //       <Table />
          //     </PrivateLayout>
          //   }/>
          // } />
          // <Route path="/findmycpe" element={
          //   <ProtectedRoute element={
          //     <PrivateLayout>
          //       <Findmycpe />
          //     </PrivateLayout>
          //   }/>
          // } />
          }
          <Route path="/editprofile" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Editprofile />
              </PrivateLayout>
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
