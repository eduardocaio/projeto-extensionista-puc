import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';

import 'react-confirm-alert/src/react-confirm-alert.css';

import CustomButton from "./CustomButton";
import "./UserList.scss";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/users", {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`
                                    }
                                })
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (id === 1) {
        toast.error("O usuário administrador do sistema não pode ser excluído!");
        return; 
    }

    confirmAlert({
        title: 'Confirmação',
        message: 'Deseja realmente excluir este usuário?',
        buttons: [
        {
            label: 'Sim',
            onClick: async () => {
            try {
                await axios.delete(`http://localhost:8080/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
                });
                toast.success("Usuário excluído com sucesso!");
                fetchUsers();
            } catch (error) {
                toast.error("Erro ao excluir usuário!");
            }
            }
        },
        {
            label: 'Não',
            onClick: () => {}
        }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
    });
  };

  const handleEdit = (user) => {
    if (user.id === 1) {
        toast.error("O usuário administrador do sistema não pode ser editado!");
        return; 
    }
    navigate(`/user-management?edit=${user.id}`, { state: { user } });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="user-list-container">
        <div className="header">
        <h2>Gerenciamento de Usuários</h2>
        <CustomButton onClick={() => navigate("/user-management")}>Novo Usuário</CustomButton>
        </div>

        {users.map((user) => (
        <div className="user-card" key={user.id}>
            <div className="user-info">
            <div className="field">
                <span className="label">Nome</span>
                <span className="value">{user.name}</span>
            </div>
            <div className="field">
                <span className="label">Sobrenome</span>
                <span className="value">{user.lastName}</span>
            </div>
            <div className="field">
                <span className="label">Nome de usuário</span>
                <span className="value">{user.username}</span>
            </div>
            <div className="field">
                <span className="label">Permissão</span>
                <span className="value">{user.role === "STANDARD" ? "PADRÃO" : user.role}</span>
            </div>
            </div>

            <div className="actions">
            <button className="edit-btn" onClick={() => handleEdit(user)}>Editar</button>

            <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Excluir
            </button>
            </div>
        </div>
        ))}
    </div>
    );
};

export default UserList;