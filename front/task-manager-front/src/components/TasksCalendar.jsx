// TasksCalendar.jsx
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TasksCalendar.scss";

const priorityColors = { HIGH: "#e53e3e", MEDIUM: "#ecc94b", LOW: "#48bb78" };
const priorityLabels = { HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" };

const TasksCalendar = ({ tasks }) => {
  const [value, setValue] = useState(new Date());

  const tasksForDate = tasks.filter(
    t => t.deadLine === value.toISOString().split("T")[0]
  );

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayTasks = tasks.filter(
        t => t.deadLine === date.toISOString().split("T")[0]
      );
      if (!dayTasks.length) return null;

      return (
        <div className="day-tasks">
          {dayTasks.map(t => (
            <span
              key={t.id}
              className="task-badge"
              style={{ backgroundColor: priorityColors[t.priority] }}
              title={`${t.description} - Responsável: ${t.assignedTo || "Sem usuário"}`}
            >
              {priorityLabels[t.priority]}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="tasks-calendar">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
      />

      <div className="tasks-list-selected-date">
        <h3>Tarefas de {value.toLocaleDateString()}</h3>
        {tasksForDate.length > 0 ? (
          <ul>
            {tasksForDate.map(t => (
              <li key={t.id} className="task-item">
                <span className="task-desc">{t.description}</span>
                <span className="task-priority" style={{ background: priorityColors[t.priority] }}>
                  {priorityLabels[t.priority]}
                </span>
                <span className="task-user">Responsável: {t.assignedTo || "Sem usuário"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma tarefa nesta data</p>
        )}
      </div>
    </div>
  );
};

export default TasksCalendar;