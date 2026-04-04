import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tasks from './components/Tasks';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';

const Layout = () => (
  <div className="app-container">
    <Sidebar />
    <Tasks />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={2500} />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;