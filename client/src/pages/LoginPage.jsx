import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInEmail = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('Logged in!');
      window.location = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  const signInGoogle = async () => {
    try {
      await signInWithGoogle();
      alert('Logged in!');
      window.location = '/';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={signInEmail} className="flex flex-col gap-2">
          <input
            className="input input-bordered"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="input input-bordered"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <div className="divider">or</div>
        <button className="btn btn-outline w-full" onClick={signInGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
