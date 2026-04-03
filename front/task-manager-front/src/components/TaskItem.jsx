import axios from 'axios';
import { useAlert } from 'react-alert';

import './TaskItem.scss'

import { MdDelete } from "react-icons/md";


const TaskItem = ({ task, fetchTasks }) => {

    const alert = useAlert();

    const handleTaskDeletion = async () =>{
        try {
            await axios.delete(`http://localhost:8080/tasks/${task.id}`);
            await fetchTasks();
            alert.success("A tarefa foi removida com sucesso!")
        } catch (_error) {
            alert.error("Algo deu errado.");
        }
    }

    const handleTaskStatus = async () => {
        try {
            await axios.put(`http://localhost:8080/tasks/${task.id}`);

            await fetchTasks();

            alert.success("A tarefa foi modificado com sucesso!");
        } catch (_error) {

            alert.error("Algo deu errado")
            
        }
    }

    return (
        <div className="task-item-container">
            <div className="task-description">
                <label className={task.status ? 'checkbox-container-completed' : 'checkbox-container'}>
                    {task.description}
                    <input type="checkbox" defaultChecked={task.status} onChange={handleTaskStatus}/>
                    <span className={task.status ? 'checkmark completed' : 'checkmark'}></span>
                </label>
            </div>

            <div className="delete">
                <MdDelete size={18} color="#F97474" onClick={handleTaskDeletion}/>
            </div>
            
        </div>
    );
};

export default TaskItem;
