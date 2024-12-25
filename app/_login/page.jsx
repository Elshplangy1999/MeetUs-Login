"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock } from "lucide-react";
import { loginUser, getUserInfo, clearValidationErrors } from '../redux/slices/authSlice';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && /^[a-zA-Z]+$/.test(password);
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user, validationErrors } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserInfo()).then((result) => {
      if (result.type === 'auth/getUserInfo/fulfilled') {
        router.push('/dashboard');
      }
    });
  }, [dispatch, router]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    dispatch(clearValidationErrors('email'));
  };

  const handlePasswordChange = (e) => {
    // Only allow letters
    const newValue = e.target.value.replace(/[^a-zA-Z]/g, '');
    setPassword(newValue);
    dispatch(clearValidationErrors('password'));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    const errors = {};
    if (!email || !validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must contain only letters';
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const userInfoResult = await dispatch(getUserInfo());
      if (getUserInfo.fulfilled.match(userInfoResult)) {
        router.push('/dashboard');
      }
    }
  };

  const isLoginDisabled = !email || !password || !validateEmail(email) || !validatePassword(password) || loading;

  return (
    // <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 overflow-hidden relative">
    //   <div className="absolute top-[-20%] left-[50%] bg-ellipse2489 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
    //   <div className="absolute bottom-[-20%] right-[-10%] bg-ellipse2488 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
    //   <div className="absolute bottom-[-20%] left-0 bg-ellipse2487 w-96 h-96 rounded-full blur-3xl opacity-10"></div>
    //   <div className="absolute top-[-20%] left-0 bg-ellipse2486 w-96 h-96 rounded-full blur-3xl opacity-10"></div>
    //   <div className="flex max-w-6xl rounded-lg">
    //     <div className="flex-[2] p-4">
    //       <h1 className="mb-1 text-[3.125rem] text-center">Welcome back</h1>
    //       <p className="text-gray-600 mb-6 text-center">
    //         Step into our shopping metaverse for an unforgettable shopping experience
    //       </p>
    //       <form onSubmit={handleSubmit}>
    //         <div className="mb-4">
    //           <div className="relative">
    //             <label className="block w-full cursor-text">
    //               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
    //                 <Mail size="20" />
    //               </div>
    //               <input
    //                 type="email"
    //                 placeholder="Email"
    //                 value={email}
    //                 onChange={handleEmailChange}
    //                 onBlur={() => handleBlur('email')}
    //                 className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
    //                   touched.email && !validateEmail(email) ? 'border-red-500' : 'border-gray-200'
    //                 }`}
    //               />
    //             </label>
    //           </div>
    //           {touched.email && !validateEmail(email) && (
    //             <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
    //           )}
    //         </div>
    //         <div className="mb-6">
    //           <div className="relative">
    //             <label className="block w-full cursor-text">
    //               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
    //                 <Lock size="20" />
    //               </div>
    //               <input
    //                 type="password"
    //                 placeholder="Password"
    //                 value={password}
    //                 onChange={handlePasswordChange}
    //                 onBlur={() => handleBlur('password')}
    //                 className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
    //                   touched.password && (!password || !validatePassword(password)) ? 'border-red-500' : 'border-gray-200'
    //                 }`}
    //               />
    //             </label>
    //           </div>
    //           {touched.password && !password && (
    //             <p className="text-red-500 text-sm mt-1">Password is required</p>
    //           )}
    //           {touched.password && password && !validatePassword(password) && (
    //             <p className="text-red-500 text-sm mt-1">Password must contain only letters</p>
    //           )}
    //         </div>
    //         <button
    //           type="submit"
    //           disabled={isLoginDisabled}
    //           className={`w-full py-2 text-white rounded-lg ${
    //             isLoginDisabled ? 'bg-gray-400' : 'bg-purple-600'
    //           }`}
    //         >
    //           {loading ? 'Loading...' : 'Login'}
    //         </button>
    //       </form>
    //       {error && (
    //         <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
    //       )}
    //       <p className="text-gray-600 text-[0.875rem] mt-9 text-center">
    //         Don&apos;t have an account?{' '}
    //         <a href="/signup" className="text-purple-500 hover:underline">
    //           Sign up
    //         </a>
    //       </p>
    //     </div>
    //     <div className="flex-[4] p-4 flex flex-col items-center justify-center ml-16">
    //       <div className="relative">
    //         <Image
    //           src="/logo.png"
    //           alt="3D Graphic"
    //           width={550}
    //           height={550}
    //           className="rotate-[-21.61deg]"
    //         />
    //         <Image
    //           src="/logo2.png"
    //           alt="3D Graphic"
    //           width={1550}
    //           height={1550}
    //           className="absolute top-[-162px] left-0 scale-[2.32] rotate-[336deg]"
    //         />
    //       </div>
    //       <div className="mt-20 ml-10">
    //         <Image
    //           src="/logoText.png"
    //           alt="3D Graphic"
    //           width={300}
    //           height={300}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    //=======================================================================

    // <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 overflow-hidden relative p-4">
    //   {/* Background elements */}
    //   <div className="absolute top-[-20%] left-[50%] bg-ellipse2489 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
    //   <div className="absolute bottom-[-20%] right-[-10%] bg-ellipse2488 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
    //   <div className="absolute bottom-[-20%] left-0 bg-ellipse2487 w-96 h-96 rounded-full blur-3xl opacity-10"></div>
    //   <div className="absolute top-[-20%] left-0 bg-ellipse2486 w-96 h-96 rounded-full blur-3xl opacity-10"></div>

    //   {/* Main container - column on mobile, row on desktop */}
    //   <div className="flex flex-col lg:flex-row max-w-6xl rounded-lg w-full">
    //     {/* Image section - top on mobile, right on desktop */}
    //     <div className="w-full lg:flex-[4] p-4 flex flex-col items-center justify-center lg:ml-16 order-1 lg:order-2">
    //       <div className="relative w-full max-w-md">
    //         <Image
    //           src="/logo.png"
    //           alt="3D Graphic"
    //           width={600}
    //           height={600}
    //           className="rotate-[-21.61deg]"
    //         />
    //         <Image
    //           src="/logo2.png"
    //           alt="3D Graphic"
    //           width={1550}
    //           height={1550}
    //           className="absolute top-[-132px] left-0 scale-[2.32] rotate-[336deg]"
    //         />
    //       </div>
    //       <div className="mt-8 lg:mt-20 lg:ml-10">
    //         <Image
    //           src="/logoText.png"
    //           alt="3D Graphic"
    //           width={400}
    //           height={400}
    //         />
    //       </div>
    //     </div>

    //     {/* Form section - bottom on mobile, left on desktop */}
    //     <div className="w-full lg:flex-[2] p-4 order-2 lg:order-1">
    //       <h1 className="mb-6 text-2xl lg:text-[3.125rem] text-center">Welcome back</h1>
    //       <p className="text-gray-600 mb-6 text-center">
    //         Step into our shopping metaverse for an unforgettable shopping experience
    //       </p>
    //       <form onSubmit={handleSubmit}>
    //         <div className="mb-4">
    //           <div className="relative">
    //             <label className="block w-full cursor-text">
    //               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
    //                 <Mail size="20" />
    //               </div>
    //               <input
    //                 type="email"
    //                 placeholder="Email"
    //                 value={email}
    //                 onChange={handleEmailChange}
    //                 onBlur={() => handleBlur('email')}
    //                 className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
    //                   touched.email && !validateEmail(email) ? 'border-red-500' : 'border-gray-200'
    //                 }`}
    //               />
    //             </label>
    //           </div>
    //           {touched.email && !validateEmail(email) && (
    //             <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
    //           )}
    //         </div>
    //         <div className="mb-6">
    //           <div className="relative">
    //             <label className="block w-full cursor-text">
    //               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
    //                 <Lock size="20" />
    //               </div>
    //               <input
    //                 type="password"
    //                 placeholder="Password"
    //                 value={password}
    //                 onChange={handlePasswordChange}
    //                 onBlur={() => handleBlur('password')}
    //                 className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
    //                   touched.password && (!password || !validatePassword(password)) ? 'border-red-500' : 'border-gray-200'
    //                 }`}
    //               />
    //             </label>
    //           </div>
    //           {touched.password && !password && (
    //             <p className="text-red-500 text-sm mt-1">Password is required</p>
    //           )}
    //           {touched.password && password && !validatePassword(password) && (
    //             <p className="text-red-500 text-sm mt-1">Password must contain only letters</p>
    //           )}
    //         </div>
    //         <button
    //           type="submit"
    //           disabled={isLoginDisabled}
    //           className={`w-full py-2 text-white rounded-lg ${
    //             isLoginDisabled ? 'bg-gray-400' : 'bg-purple-600'
    //           }`}
    //         >
    //           {loading ? 'Loading...' : 'Login'}
    //         </button>
    //       </form>
    //       {error && (
    //         <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
    //       )}
    //       <p className="text-gray-600 text-[0.875rem] mt-9 text-center">
    //         Don&apos;t have an account?{' '}
    //         <a href="/signup" className="text-purple-500 hover:underline">
    //           Sign up
    //         </a>
    //       </p>
    //     </div>
    //   </div>
    // </div>

    //=====================================================================================
<div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 overflow-x-hidden lg:overflow-hidden relative flex-col md:flex-row">
  <div className="absolute top-[-20%] left-[50%] bg-ellipse2489 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
  <div className="absolute bottom-[-20%] right-[-10%] bg-ellipse2488 w-96 h-96 rounded-full blur-3xl opacity-50"></div>
  <div className="absolute bottom-[-20%] left-0 bg-ellipse2487 w-96 h-96 rounded-full blur-3xl opacity-10"></div>
  <div className="absolute top-[-20%] left-0 bg-ellipse2486 w-96 h-96 rounded-full blur-3xl opacity-10"></div>
  <div className="flex max-w-6xl rounded-lg flex-col md:flex-row">
    <div className="flex-[4] p-4 flex flex-col items-center justify-center mt-40 lg:mt-0 order-1 md:order-2">
      <div className="relative">
        <Image
          src="/logo.png"
          alt="3D Graphic"
          width={550}
          height={550}
          className="rotate-[-21.61deg]"
        />
        <Image
          src="/logo2.png"
          alt="3D Graphic"
          width={1550}
          height={1550}
          className="absolute top-[-100px] lg:top-[-162px] left-0 scale-[2.32] rotate-[336deg]"
        />
      </div>
      <div className="mt-20 lg:ml-10">
        <Image
          src="/logoText.png"
          alt="3D Graphic"
          width={300}
          height={300}
        />
      </div>
    </div>
    <div className="flex-[2] p-4 order-2 md:order-1">
      <h1 className="mb-1 text-[3.125rem] text-center">Welcome back</h1>
      <p className="text-gray-600 mb-6 text-center">
        Step into our shopping metaverse for an unforgettable shopping experience
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative">
            <label className="block w-full cursor-text">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
                <Mail size="20" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
                  touched.email && !validateEmail(email) ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </label>
          </div>
          {touched.email && !validateEmail(email) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
          )}
        </div>
        <div className="mb-6">
          <div className="relative">
            <label className="block w-full cursor-text">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none z-10">
                <Lock size="20" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-2 pl-10 rounded-lg placeholder-[#62626B] transition-all focus:outline-none focus:placeholder-opacity-0 bg-white border ${
                  touched.password && (!password || !validatePassword(password)) ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </label>
          </div>
          {touched.password && !password && (
            <p className="text-red-500 text-sm mt-1">Password is required</p>
          )}
          {touched.password && password && !validatePassword(password) && (
            <p className="text-red-500 text-sm mt-1">Password must contain only letters</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoginDisabled}
          className={`w-full py-2 text-white rounded-lg ${
            isLoginDisabled ? 'bg-gray-400' : 'bg-purple-600'
          }`}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
      <p className="text-gray-600 text-[0.875rem] mt-9 text-center">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-purple-500 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>
  );
}