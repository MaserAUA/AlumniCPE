import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/auth_context"
import ProtectedRoute from "./components/ProtectedRoute";

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
// import Login from "./components/pages/Login";
import Login from "./pages/public/Login";
// import Register from "./components/pages/Register";
import Register from "./pages/public/Register";
import Page404 from "./components/common/Page404";
// import RegisterCPE from "./components/pages/Registercpe";
import RegisterCPE from "./pages/public/RegisterCPE";
import RequestOTR from "./pages/public/RequestOTR";
import ForgotPassword from "./components/pages/ForgotPassword";
import EmailVerification from "./components/pages/EmailVerification";

// Private Components
import Homeuser from "./components/private/Homeuser";
import NavbarUser from "./components/private/NavbarUser";
import Newuser from "./components/private/Newuser";
import Newsdetail from "./components/private/Newsdetail"; // Keep in private folder but make publicly accessible
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




// Create a function to check if user is authenticated
const useRequireAuth = () => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  
  // Return if authenticated, otherwise redirect to login
  return isAuthenticated 
    ? true 
    : <Navigate to="/login" state={{ from: location }} replace />;
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
          <Route path="/" element={<PublicLayout><Homepage /></PublicLayout>} />
          <Route path="/aboutus" element={<PublicLayout><Aboutus /></PublicLayout>} />
          <Route path="/event" element={<PublicLayout><Event posts={posts} /></PublicLayout>} />
          <Route path="/new" element={<PublicLayout><New posts={posts} /></PublicLayout>} />
          <Route path="/coming" element={<PublicLayout><Coming /></PublicLayout>} />
          <Route path="/number" element={<PublicLayout><Number /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registry" element={<Register />} />
          <Route path="/registryCPE" element={<RegisterCPE/>} />
          <Route path="/RequestOTR" element={<RequestOTR/>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/emailverification" element={<EmailVerification />} />

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
          <Route path="/newuser" element={
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
          <Route path="/newsdetail" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Newsdetail onUpdatePost={handleEditPost} />
              </PrivateLayout>
            }/>
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
          <Route path="/editpostmodal" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <ChatProvider>
                  <Editpostmodal />
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
          <Route path="/card" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Card />
              </PrivateLayout>
            }/>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            }/>
          } />
          <Route path="/table" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Table />
              </PrivateLayout>
            }/>
          } />
          <Route path="/findmycpe" element={
            <ProtectedRoute element={
              <PrivateLayout>
                <Findmycpe />
              </PrivateLayout>
            }/>
          } />
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
      </AuthProvider>
    </Router>
  );
};

export default App;
