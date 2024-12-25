"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout, getUserInfo } from '../redux/slices/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserInfo()).then((result) => {
      if (result.type === 'auth/getUserInfo/rejected') {
        router.push('/');
      }
    });
  }, [dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
            <p className="text-gray-600">ID: {user.id}</p>
            <p className="text-gray-600">Name: {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}