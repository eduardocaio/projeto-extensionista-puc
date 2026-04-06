import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import CustomButton from "./CustomButton";
import "./ProjectManagement.scss";

const ProjectManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const projectFromState = location.state?.project;
  const projectId = projectFromState?.id; 

  const [project, setProject] = useState({
    name: "",
    deadLine: "",
    status: "ACTIVE"
  });

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (projectFromState) {
        setProject({
        id: projectFromState.id, 
        name: projectFromState.name,
        deadLine: projectFromState.deadLine,
        status: projectFromState.status
        });
    }
  }, [projectFromState]);

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!project.name || !project.deadLine) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: project.id,    
        name: project.name,
        deadLine: project.deadLine,
        status: project.status
      };

        if (projectId) {
            await axios.put(`http://localhost:8080/projects/${projectId}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Projeto atualizado com sucesso!")
        } else {
            await axios.post("http://localhost:8080/projects", payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Projeto criado com sucesso!")
        }

      navigate("/project-list");
    } catch (error) {
      toast.error("Erro ao salvar projeto!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-container">
      <h2>{projectId ? "Editar Projeto" : "Novo Projeto"}</h2>

      <div className="form-group">
        <label>Nome *</label>
        <input
          type="text"
          name="name"
          value={project.name}
          onChange={handleChange}
          placeholder="Nome do projeto"
        />
      </div>

      <div className="form-group">
        <label>Prazo *</label>
        <input
          type="date"
          name="deadLine"
          value={project.deadLine}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={project.status}
          onChange={handleChange}
        >
          <option value="ACTIVE">ATIVO</option>
          <option value="FINISHED">FINALIZADO</option>
          <option value="INACTIVE">INATIVO</option>
        </select>
      </div>

      <div className="actions">
        <CustomButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </CustomButton>

        <button className="cancel-btn" onClick={() => navigate("/project-list")}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProjectManagement;