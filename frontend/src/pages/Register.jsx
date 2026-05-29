import { useState } from 'react';
import axios from 'axios';

export default function Register() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const register = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        'http://localhost:3000/api/auth/register',
        form
      );

      alert('Registered successfully');

    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">

      <form
        onSubmit={register}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded-xl mb-4"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

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

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-3 rounded-xl mb-4"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <button
          className="w-full bg-orange-500 text-white p-3 rounded-xl"
        >
          Register
        </button>

      </form>

    </div>
  );
}
