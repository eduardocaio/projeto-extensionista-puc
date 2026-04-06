import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.scss";

const Dashboard = () => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedOptionPath, setSelectedOptionPath] = useState("");

  const options = [
    { title: "Minhas Tarefas", description: "Visualize e gerencie suas tarefas", path: "/tasks-kanban" },
    { title: "Gerenciador de Projetos", description: "Gerencie os projetos e tarefas da sua equipe", path: "/project-list", adminOnly: true },
    { title: "Gerenciamento de usuários", description: "Gerencie os usuários da sua equipe", path: "/user-list", adminOnly: true }
  ];

  const visibleOptions = options.filter(option => !option.adminOnly || role === "ADMIN");

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/projects/my-projects/${localStorage.getItem("username")}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProjects(data);
    } catch {
      toast.error("Erro ao carregar projetos!");
    }
  };

  const handleOptionClick = async (option) => {
    if (option.title === "Minhas Tarefas") {
      await fetchProjects();
      setSelectedOptionPath(option.path);
      setShowProjectModal(true);
    } else {
      window.location.href = option.path;
    }
  };

  const handleProjectSelect = (projectId) => {
    setShowProjectModal(false);
    console.log("projectId:", projectId);
    window.location.href = `${selectedOptionPath}?projectId=${projectId}`;
  };

  return (
    <div className="dashboard-container">
      <h1>Olá, {name}!</h1>
      <p>O que você deseja fazer hoje?</p>

      <div className="options-grid">
        {visibleOptions.map((option, index) => (
          <div key={index} className="option-card" onClick={() => handleOptionClick(option)}>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </div>
        ))}
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

export default Dashboard;