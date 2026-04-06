import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

import CustomButton from "./CustomButton";
import ProjectsCalendar from "./ProjectsCalendar";
import "./ProjectsList.scss";

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMembersFor, setShowMembersFor] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [userPage, setUserPage] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const searchTimeout = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProjects(data);
    } catch {
      toast.error("Erro ao carregar projetos!");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (projectId, page = 0, append = false) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/users`, {
        params: { page, search: searchUser },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const projectMembersRes = await axios.get(`http://localhost:8080/projects/find-members/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const projectUsernames = projectMembersRes.data
        .filter(u => u.inProject)
        .map(u => u.username);

      if (!append) setSelectedUsers(projectUsernames);

      const combined = [
        ...data.filter(u => projectUsernames.includes(u.username)),
        ...data.filter(u => !projectUsernames.includes(u.username))
      ];

      setUsers(prev => append ? [...prev, ...combined] : combined);
      setHasMoreUsers(data.length === 10);
      setUserPage(page + 1);
    } catch {
      toast.error("Erro ao carregar usuários!");
    }
  };

  const handleAddMembersClick = (projectId) => {
    if (showMembersFor === projectId) {
      setShowMembersFor(null);
      setUsers([]);
      setUserPage(0);
      setSearchUser("");
      setHasMoreUsers(true);
    } else {
      setShowMembersFor(projectId);
      fetchUsers(projectId);
    }
  };

  const handleUserToggle = (username) => {
    setSelectedUsers(prev =>
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const handleSaveMembers = async (projectId) => {
    try {
      await axios.put(`http://localhost:8080/projects/add-members/${projectId}`, selectedUsers, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Membros atualizados com sucesso!");
      setShowMembersFor(null);
      setUsers([]);
      setUserPage(0);
      setSearchUser("");
      setHasMoreUsers(true);
    } catch {
      toast.error("Erro ao atualizar membros!");
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja realmente excluir este projeto?',
      buttons: [
        { label: 'Sim', onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/projects/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
              });
              toast.success("Projeto excluído com sucesso!");
              fetchProjects();
            } catch {
              toast.error("Erro ao excluir projeto!");
            }
          }
        },
        { label: 'Não', onClick: () => {} }
      ]
    });
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (showMembersFor) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        fetchUsers(showMembersFor, 0, false);
      }, 400);
    }
  }, [searchUser]);

  const formatDate = date => {
    if (!date) return "-";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusLabel = status => {
    switch (status) {
      case "ACTIVE": return "ATIVO";
      case "FINISHED": return "FINALIZADO";
      case "INACTIVE": return "INATIVO";
      default: return status;
    }
  };

  const getCardClass = deadLine => {
    if (!deadLine) return "";
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    const todayStr = `${yyyy}-${String(mm).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;
    if (deadLine < todayStr) return "overdue";
    if (deadLine === todayStr) return "due-today";
    return "";
  };

  const filterByStatus = status => projects.filter(p => p.status === status);

  if (loading) return <p>Carregando projetos...</p>;

  return (
    <div className="projects-container">
      <div className="header">
        <h2>Projetos</h2>
        <div className="header-buttons">
          <CustomButton onClick={() => navigate("/project-management")}>
            Novo Projeto
          </CustomButton>
          <CustomButton 
            variant="outline"
            onClick={() => setShowCalendar(!showCalendar)}
            className="toggle-calendar-btn"
          >
            {showCalendar ? "Voltar para a lista" : "Mostrar calendário"}
          </CustomButton>
        </div>
      </div>

      {showCalendar ? (
        <ProjectsCalendar projects={projects} />
      ) : (
        <>
          {["ACTIVE","FINISHED","INACTIVE"].map(status => (
            <Section
              key={status}
              title={status === "ACTIVE" ? "Ativos" : status === "FINISHED" ? "Finalizados" : "Inativos"}
              projects={filterByStatus(status)}
              formatDate={formatDate}
              getStatusLabel={getStatusLabel}
              getCardClass={getCardClass}
              navigate={navigate}
              handleAddMembersClick={handleAddMembersClick}
              showMembersFor={showMembersFor}
              users={users}
              selectedUsers={selectedUsers}
              handleUserToggle={handleUserToggle}
              handleSaveMembers={handleSaveMembers}
              handleDelete={handleDelete}
              setSearchUser={setSearchUser}
              fetchMoreUsers={() => fetchUsers(showMembersFor, userPage, true)}
              hasMoreUsers={hasMoreUsers}
              searchUser={searchUser}
            />
          ))}
        </>
      )}
    </div>
  );
};

const Section = ({
  title, projects, formatDate, getStatusLabel, getCardClass, navigate,
  handleAddMembersClick, showMembersFor, users, selectedUsers, handleUserToggle,
  handleSaveMembers, handleDelete, setSearchUser, fetchMoreUsers, hasMoreUsers, searchUser
}) => {
  if (!projects.length) return null;

  const handleScroll = e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
    if (bottom && hasMoreUsers) fetchMoreUsers();
  };

  return (
    <div className="section">
      <h3>{title}</h3>
      {projects.map(project => (
        <div className={`project-card ${getCardClass(project.deadLine)}`} key={project.id}>
          <div className="project-info">
            <div className="field"><span className="label">Nome</span><span className="value">{project.name}</span></div>
            <div className="field"><span className="label">Criado em</span><span className="value">{formatDate(project.registrationDate)}</span></div>
            <div className="field"><span className="label">Prazo Final</span><span className="value">{formatDate(project.deadLine)}</span></div>
            <div className="field"><span className="label">Status</span><span className="value">{getStatusLabel(project.status)}</span></div>
          </div>

          <div className="actions">
            <button className="edit-btn" onClick={() => navigate("/project-management", { state: { project } })}>Editar</button>
            <button className="delete-btn" onClick={() => handleDelete(project.id)}>Excluir</button>
            <button className="edit-btn" onClick={() => handleAddMembersClick(project.id)}>Gerenciar Membros</button>
            <button className="view-tasks-btn" onClick={() => navigate("/tasks-kanban", { state: { projectId: project.id } })}>Ver Tarefas</button>
          </div>

          {showMembersFor === project.id && (
            <div className="members-list" onScroll={handleScroll}>
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="user-search"
              />
              <div className="users-grid">
                {users
                  .filter(u =>
                    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                    u.username.toLowerCase().includes(searchUser.toLowerCase())
                  )
                  .map(user => (
                    <div
                      key={user.username}
                      className={`member-item ${selectedUsers.includes(user.username) ? "selected" : ""}`}
                      onClick={() => handleUserToggle(user.username)}
                    >
                      <div className="avatar">{user.name[0]}</div>
                      <div className="user-info">
                        <span className="member-name">{user.name}</span>
                        <span className="member-username">{user.username}</span>
                      </div>
                      <input type="checkbox" checked={selectedUsers.includes(user.username)} readOnly />
                    </div>
                  ))}
              </div>
              <CustomButton onClick={() => handleSaveMembers(project.id)}>Salvar Membros</CustomButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;