import { useState } from 'react';
import axios from 'axios';

export default function Login() {

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const login = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        'http://YOUR_EC2_PUBLIC_IP/api/auth/login',
        form
      );

      localStorage.setItem('token', res.data.token);

      alert('Login successful');

    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">

      <form
        onSubmit={login}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-4"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="w-full bg-orange-500 text-white p-3 rounded-xl"
        >
          Login
        </button>

      </form>

    </div>
  );
}
