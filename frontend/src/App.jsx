import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';


import Dashboard from './pages/Admin/Dashboard.jsx';
import Login from './pages/Auth/Login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';
import ManageTasks from './pages/Admin/ManageTasks.jsx';
import CreateTask from './pages/Admin/CreateTask.jsx';
import ManageUser from './pages/Admin/ManageUser.jsx';
import UserDashboard from './pages/User/UserDashboard.jsx';
import MyTasks from './pages/User/MyTasks.jsx';
import ViewTaskDetails from './pages/User/ViewTaskDetails.jsx';

import PrivateRoute from './routes/PrivateRoutes.jsx';
import UserProvider, { UserContext } from './context/userContext.jsx';
import { Toaster } from 'react-hot-toast';
import VideoCall from './pages/Admin/VideoCall.jsx';

import MeetingPage from './pages/User/MeetingPage.jsx';





import UserVideocall from './pages/User/UserVideocall.jsx';
import Chat from './pages/Common/Chat.jsx';
import Footer from './components/Footer.jsx';

// Wrapper component to get roomName from URL params and pass to VideoCall
const VideoCallWrapper = () => {
  const { roomName } = useParams();
  return <VideoCall roomName={roomName} />;
};

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUser />} />
              <Route path='/admin/video-call/:roomName' element={<VideoCall />} />
              <Route path='/admin/messages' element={<Chat />} />

            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTasks />} />
              <Route path="/user/meeting" element={<MeetingPage />} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
              <Route path='/user/messages' element={<Chat />} />
              <Route path='/user/video-call/:roomName' element={<UserVideocall />} />

            </Route>

            {/* Default Route */}
            <Route path='/' element={<Root />} />
          </Routes>
          <AnimatePresence />
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
      <Footer />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};
