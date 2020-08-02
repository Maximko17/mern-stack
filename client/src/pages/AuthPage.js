import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/httpHook";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registrHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (error) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
      message(data.message);
    } catch (error) {}
  };
  return (
    <div className="row">
      <label htmlFor="first_name">Email</label>
      <input
        placeholder="Введите email"
        id="email"
        type="text"
        name="email"
        value={form.email}
        onChange={changeHandler}
      />
      <label htmlFor="first_name">Пароль</label>
      <input
        placeholder="Введите пароль"
        id="password"
        type="password"
        name="password"
        value={form.password}
        onChange={changeHandler}
      />
      <button
        className="btn yellow darken-4"
        onClick={loginHandler}
        disabled={loading}
      >
        Войти
      </button>
      <button
        className="btn grey lighten-1 black-text"
        onClick={registrHandler}
        disabled={loading}
      >
        Регистрация
      </button>
    </div>
  );
};
