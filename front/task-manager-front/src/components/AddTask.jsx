import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

import "./AddTask.scss"

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { useAlert } from "react-alert";

const AddTask = ({ fetchTasks }) => {
    const [task, setTask] = useState("")

    const alert = useAlert();

    const onChange = (e) => {
        setTask(e.target.value);
    }


    const handleTaskAddition = async () => {
        try {
            if (task.length === 0) {
                return alert.error("A tarefa precisa de uma descrição para ser adicionada!")
            }
            await axios.post('http://localhost:8080/tasks', { description: task, status: false });

            await fetchTasks();

            setTask("");

            await alert.success("A tarefa foi adicionada com sucesso!");

        } catch (_error) {
            alert.error("Ocorreu um erro ao adicionar a tarefa!");
        }
    }

    return (
        <div className="add-task-container">
            <CustomInput label="Adicionar tarefa..." value={task} onChange={onChange} onEnterPress={handleTaskAddition} />
            <CustomButton onClick={handleTaskAddition}><FaPlus size={14} color="#ffffff" /></CustomButton>
        </div>
    )

}

export default AddTask;