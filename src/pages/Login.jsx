import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/playerSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, form);
      dispatch(login(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-2/3 object-cover">
        <img src="https://i.pinimg.com/1200x/c8/5a/c3/c85ac3d9c2290e2dac785da29864feff.jpg" className="flex-1 w-full h-screen" alt="" />
      </div>
      <div className="flex-1 flex flex-col gap-4 p-5">
        <div className="flex flex-col items-center gap-1">
          <p className="text-5xl font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent text-shadow-lg">FunnyGun</p>
          <h2 className="text-sm font-normal">Welcome To Mars Game</h2>
        </div>
        <form action="" className="flex flex-col gap-3">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
            className="input input-primary w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
            className="input input-primary w-full"
          />
          <button onClick={handleLogin} disabled={loading} className="btn btn-primary font-black">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <Link className="link link-primary text-center" to="/register">
          Do you have not an account?
        </Link>
      </div>
    </div>
  );
};

export default Login;