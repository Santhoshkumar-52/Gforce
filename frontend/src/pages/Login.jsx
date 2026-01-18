import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../store/useStore.js";
import "../styles/login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const baseUrl = useAuthStore((state) => state.baseUrl);
  const saveuser = useAuthStore((state) => state.saveUser);
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Required!",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
      return;
    }
    await axios
      .post(`${baseUrl}/api/login`, form)
      .then((response) => {
        const {
          staff: { fullName },
        } = response.data.user;
        const userdetails = response.data.user;

        saveuser(userdetails);
        navigate("/dashboard");

        Swal.fire({
          toast: true,
          icon: "success",
          title: `Welcome Back, ${fullName}`,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          toast: true,
          icon: "error",
          title: error.response?.data?.message || "Login failed",
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
      });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* FULLSCREEN BACKGROUND IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80"
        alt="Gym"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlays (light tint so text stays readable) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* LOGIN FORM — GLASS BLUR */}
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 shadow-xl w-80"
          style={{
            marginTop: "60px", // pushes form slightly down
          }}
        >
          <h2
            className="text-2xl font-bold text-center mb-6 tracking-wide"
            style={{ color: "var(--login-text)" }}
          >
            GFORCE CRM LOGIN
          </h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-md outline-none shadow-sm"
            style={{
              background: "var(--login-input-bg)",
              border: `1px solid var(--login-input-border)`,
            }}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded-md outline-none shadow-sm"
            style={{
              background: "var(--login-input-bg)",
              border: `1px solid var(--login-input-border)`,
            }}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-white transition-all"
            style={{
              background: "var(--login-accent)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "var(--login-accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "var(--login-accent)")
            }
          >
            Login
          </button>

          <p
            className="text-center text-sm mt-5"
            style={{ color: "var(--login-muted)" }}
          >
            Strength. Discipline. Consistency.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
