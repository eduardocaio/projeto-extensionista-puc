import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ProjectsCalendar.scss";

const ProjectsCalendar = ({ projects }) => {
  const [value, setValue] = useState(new Date());

  const formatDate = date => date.toISOString().split("T")[0];

  const projectsForDate = projects.filter(p => formatDate(new Date(p.deadLine)) === formatDate(value));

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayProjects = projects.filter(p => formatDate(new Date(p.deadLine)) === formatDate(date));
      if (!dayProjects.length) return null;

      return (
        <div className="day-projects">
          {dayProjects.map(p => (
            <span
              key={p.id}
              className="project-badge"
              title={`${p.name} - Prazo final: ${p.deadLine}`}
              style={{ backgroundColor: "#00d1b2" }}
            >
              {p.name}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="projects-calendar">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
      />

      <div className="projects-list-selected-date">
        <h3>Projetos com prazo em {value.toLocaleDateString()}</h3>
        {projectsForDate.length > 0 ? (
          <ul>
            {projectsForDate.map(p => (
              <li key={p.id} className="project-item">
                <span className="project-name">{p.name}</span>
                <span className="project-endDate">Prazo: {new Date(p.deadLine).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum projeto nesta data</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsCalendar;