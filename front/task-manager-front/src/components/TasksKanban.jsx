import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./TasksKanban.scss";
import TasksCalendar from "./TasksCalendar";

const priorityColors = { HIGH: "#e53e3e", MEDIUM: "#ecc94b", LOW: "#48bb78" };
const statusLabels = { TODO: "Em aberto", IN_PROGRESS: "Em andamento", DONE: "Finalizado" };

const TasksKanban = () => {
  const location = useLocation();
  const projectIdFromState = location.state?.projectId;
  const queryParams = new URLSearchParams(location.search);
  const projectIdFromQuery = queryParams.get("projectId");

  const projectId = projectIdFromState || projectIdFromQuery;

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); 
  const [currentTask, setCurrentTask] = useState({ description: "", priority: "LOW", assignedTo: "", deadLine: ""});
  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [showCalendar, setShowCalendar] = useState(false);

  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const formatDate = (date) => {
    if (!date) return "-";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const isOverdue = (deadLine) => {
    if (!deadLine) return false;
    const today = new Date().toISOString().split("T")[0];
    return deadLine < today;
  };

  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      let url;
      let config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      if (projectIdFromState) {
        url = `http://localhost:8080/tasks/find-by-project-user/${projectId}`;
      } else {
        url = `http://localhost:8080/tasks/find-by-project-user/${projectId}`;
        config.params = { username };
      }
      const { data } = await axios.get(url, config);
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar tarefas!");
    } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/users", 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setUsers(data);
    } catch { toast.error("Erro ao carregar usuários!"); }
  };

  useEffect(() => { fetchTasks(); fetchUsers(); }, [projectId]);

  const sortByPriority = (tasks) => {
    const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    return tasks.sort((a,b) => order[a.priority] - order[b.priority]);
  };

  const groupedTasks = {
    TODO: sortByPriority(tasks.filter(t => t.status==="TODO")),
    IN_PROGRESS: sortByPriority(tasks.filter(t => t.status==="IN_PROGRESS")),
    DONE: sortByPriority(tasks.filter(t => t.status==="DONE"))
  };

  const handleDragStart = (e, task) => { e.dataTransfer.setData("taskId", task.id); };
  const handleDrop = async (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id.toString() === taskId);
    if (!task || task.status===status) return;
    try {
      await axios.put(
        `http://localhost:8080/tasks/update-status/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Tarefa atualizada!");
      fetchTasks();
    } catch { toast.error("Erro ao atualizar tarefa!"); }
  };

  const openModal = (type, task=null) => {
    setModalType(type);
    setCurrentTask(task 
      ? { ...task, deadLine: task.deadLine || "" } 
      : { description: "", priority: "LOW", assignedTo: "", deadLine: "" }
    );
    setShowModal(true);
  };

  const handleSaveTask = async () => {
    if (!currentTask.description || !currentTask.assignedTo || !currentTask.deadLine) {
      return toast.error("Preencha todos os campos!");
    }
    try {
      if(modalType==="create") {
        await axios.post(`http://localhost:8080/tasks`, { ...currentTask, projectId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        toast.success("Tarefa criada!");
      } else {
        await axios.put(`http://localhost:8080/tasks/${currentTask.id}`,
          { description: currentTask.description, priority: currentTask.priority, assignedTo: currentTask.assignedTo, deadLine: currentTask.deadLine },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        toast.success("Tarefa atualizada!");
      }
      setShowModal(false);
      fetchTasks();
    } catch { toast.error("Erro ao salvar tarefa!"); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Tarefa excluída!");
      setConfirmDelete(null);
      fetchTasks();
    } catch { toast.error("Erro ao excluir tarefa!"); }
  };

  if (loading) return <p>Carregando tarefas...</p>;

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>Quadro de Tarefas</h2>
        <div className="header-buttons">
          {isAdmin && (
            <button className="add-task-btn" onClick={()=>openModal("create")}>Nova Tarefa</button>
          )}
          <button className="toggle-view-btn" onClick={() => setShowCalendar(!showCalendar)}>
            {showCalendar ? "Voltar para o quadro" : "Mostrar Calendário"}
          </button>
        </div>
      </div>

      {showCalendar ? (
        <TasksCalendar tasks={tasks} />
      ) : (
        <div className="kanban-columns">
          {["TODO","IN_PROGRESS","DONE"].map(status=>(
            <div key={status} className="kanban-column" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,status)}>
              <h3>{statusLabels[status]}</h3>
              <div className="tasks-list">
                {groupedTasks[status].map(task=>(
                  <div className={`task-card ${isOverdue(task.deadLine) ? "overdue" : ""}`} draggable onDragStart={e=>handleDragStart(e,task)} style={{ borderLeft:`6px solid ${priorityColors[task.priority]}` }}>
                    <div className="task-main" onClick={() => isAdmin && openModal("edit",task)}>
                      <div className="task-header"><span className="task-desc">{task.description}</span></div>
                      <div className="task-user"><span className="user-icon">👤</span><span>{task.assignedTo || "Sem usuário"}</span></div>
                      <div className="task-dates">
                        <div className="date-item"><span className="label">Cadastro</span><span className="value">{formatDate(task.registrationDate)}</span></div>
                        <div className="date-item"><span className="label">Prazo</span><span className={`value ${isOverdue(task.deadLine) ? "late" : ""}`}>{formatDate(task.deadLine)}</span></div>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="task-actions">
                        <button onClick={()=>openModal("edit",task)}>✎</button>
                        <button onClick={()=>setConfirmDelete(task.id)}>🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalType==="create" ? "Nova Tarefa" : "Editar Tarefa"}</h3>
            <input type="text" placeholder="Descrição" value={currentTask.description} onChange={e=>setCurrentTask({...currentTask, description:e.target.value})} />
            <select value={currentTask.priority} onChange={e=>setCurrentTask({...currentTask, priority:e.target.value})}>
              <option value="HIGH">Alta</option><option value="MEDIUM">Média</option><option value="LOW">Baixa</option>
            </select>
            <select value={currentTask.assignedTo} onChange={e=>setCurrentTask({...currentTask, assignedTo:e.target.value})}>
              <option value="">Selecione o usuário</option>
              {users.map(u=><option key={u.username} value={u.username}>{u.name}</option>)}
            </select>
            <div className="form-group">
              <label>Prazo final</label>
              <input type="date" className="date-input" value={currentTask.deadLine} onChange={e => setCurrentTask({ ...currentTask, deadLine: e.target.value })}/>
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveTask}>{modalType==="create" ? "Adicionar" : "Salvar"}</button>
              <button onClick={()=>setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Exclusão</h3>
            <p>Deseja realmente excluir esta tarefa?</p>
            <div className="modal-actions">
              <button onClick={handleDelete}>Sim</button>
              <button onClick={()=>setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksKanban;