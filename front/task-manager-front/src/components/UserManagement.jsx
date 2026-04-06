import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

import "./UserManagement.scss";

const UserManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editUser = location.state?.user; // pega dados do usuário passado via navigate

  const [name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Padrão");

  useEffect(() => {
    if (editUser) {
      setFirstName(editUser.name);
      setLastName(editUser.lastName);
      setUsername(editUser.username);
      setRole(editUser.role === "STANDARD" ? "Padrão" : "Administrador");
      // opcional: limpar password para edição
      setPassword("");
    }
  }, [editUser]);

  const roleMap = {
    "Padrão": "STANDARD",
    "Administrador": "ADMIN",
  };

  const handleSaveUser = async () => {
    if (!name || !lastName || !username || !password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      if (editUser) {
        
        await axios.put(`http://localhost:8080/users/${editUser.id}`, {
          name,
          lastName,
          username,
          password, 
          role: roleMap[role] || "STANDARD",
        },
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        
        await axios.post("http://localhost:8080/auth/register", {
          name,
          lastName,
          username,
          password,
          role: roleMap[role] || "STANDARD",
        },
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Usuário criado com sucesso!");
      }

      navigate("/user-list");
    } catch (error) {
      toast.error("Erro ao salvar usuário!");
    }
  };

  return (
    <div className="user-management-container">
      <h2>Gerenciamento de Usuários</h2>
      <p>{editUser ? "Edite os dados do usuário" : "Crie novos usuários com permissões específicas"}</p>

      <div className="user-form">
        <CustomInput
          label="Primeiro Nome"
          value={name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <CustomInput
          label="Último Nome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <CustomInput
          label="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Campo de senha sempre visível */}
        <CustomInput
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="role-select">
          <label>Permissões do usuário</label>
          <div className="custom-dropdown">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Padrão">Padrão</option>
              <option value="Administrador">Administrador</option>
            </select>
            <span className="arrow">▾</span>
          </div>
        </div>

        <CustomButton onClick={handleSaveUser}>
          {editUser ? "Salvar Alterações" : "Criar Usuário"}
        </CustomButton>
      </div>
    </div>
  );
};

export default UserManagement;