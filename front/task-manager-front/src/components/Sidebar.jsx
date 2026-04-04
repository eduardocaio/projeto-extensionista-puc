import CustomButton from './CustomButton';
import { useNavigate } from 'react-router-dom';

import './Sidebar.scss';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
    const navigate = useNavigate();

   
    const name = localStorage.getItem("name");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/login");
    }

    return(
        <div className="sidebar-container">
            <div className="logo">
                <img src={logo} alt="Açaí da Fiona"/>
            </div>

            {name && (
                <div className="user-info">
                    <span>Olá, {name}!</span>
                </div>
            )}

            <div className="sign-out">
                <CustomButton onClick={handleLogout}>Sair</CustomButton>
            </div>
        </div>
    )
}

export default Sidebar;