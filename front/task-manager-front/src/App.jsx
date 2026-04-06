import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tasks from './components/TasksKanban';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import UserManagement from "./components/UserManagement";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';
import UserList from "./components/UserList";
import ProjectsList from "./components/ProjectsList";
import ProjectManagement from "./components/ProjectManagement";

const Layout = ({ children }) => (
  <div className="app-container" style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <div className="main-content" style={{ flex: 1, overflowY: "auto" }}>
      {children}
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={2500} />

      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rota privada: Dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } 
        />
       
        <Route 
          path="/tasks-kanban"
          element={
            <PrivateRoute>
              <Layout>
                <Tasks />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/user-list"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <UserList />
            </PrivateRoute>
          }
        />  

        <Route
          path="/user-management"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <UserManagement />
            </PrivateRoute>
          }
        />  

        <Route 
          path="/project-list" 
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <ProjectsList />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/project-management" 
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <ProjectManagement />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;