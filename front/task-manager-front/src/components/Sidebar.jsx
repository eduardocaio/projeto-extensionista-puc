import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CustomButton from './CustomButton';
import './Sidebar.scss';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedOptionPath, setSelectedOptionPath] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const options = [
    { title: "Dashboard", path: "/", roles: ["STANDARD", "ADMIN"] },
    { title: "Minhas Tarefas", path: "/tasks-kanban", roles: ["STANDARD", "ADMIN"] },
    { title: "Gerenciamento de Projetos", path: "/project-list", roles: ["ADMIN"] },
    { title: "Gerenciamento de usuários", path: "/user-list", roles: ["ADMIN"] }
  ];

  const filteredOptions = options.filter(option => option.roles.includes(role));

  const handleOptionClick = async (option) => {
    if (option.title === "Minhas Tarefas") {
      try {
        const { data } = await axios.get(`http://localhost:8080/projects/my-projects/${localStorage.getItem("username")}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setProjects(data);
        setSelectedOptionPath(option.path);
        setShowProjectModal(true);
      } catch {
        toast.error("Erro ao carregar projetos!");
      }
    } else {
      navigate(option.path);
    }
  };

  const handleProjectSelect = (projectId) => {
    setShowProjectModal(false);
    navigate(`${selectedOptionPath}?projectId=${projectId}`);
  };

  return (
    <div className="sidebar-container">
      <div className="logo">
        <img src={logo} alt="Logo"/>
      </div>

      <div className="sidebar-options">
        {filteredOptions.map((option, index) => (
          <div key={index} className="sidebar-option" onClick={() => handleOptionClick(option)}>
            {option.title}
          </div>
        ))}
      </div>

      <div className="sign-out">
        <CustomButton onClick={handleLogout}>Sair</CustomButton>
      </div>

      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Selecione um projeto</h3>
            <div className="project-list">
              {projects.map(project => (
                <button key={project.id} onClick={() => handleProjectSelect(project.id)}>
                  {project.name}
                </button>
              ))}
            </div>
            <button className="cancel-btn" onClick={() => setShowProjectModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;