import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Login.scss";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login inválido");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      toast.success("Login realizado com sucesso!");

      navigate("/");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <CustomInput
        type="text"
        label="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        <CustomInput
        type="password"
        label="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        <CustomButton onClick={handleLogin}>Entrar</CustomButton>
      </form>
    </div>
  );
}

export default Login;