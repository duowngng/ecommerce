'use client'
// import React from 'react'
// import { Button } from "@/components/ui/button";

// function SignIn() {
//   return (
//     <>
//     <Button 
//     size="default"
//     variant="default"
//     >
//       Log in
//     </Button>
//     </>
//   )
// }

// export default SignIn

'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebaseConfig'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const router = useRouter()

    const handleEmail = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password);
            console.log({ res });
            setEmail('');
            setPassword('');
            router.push('/')
        } catch(e){
            console.error(e)
        }
    };

    const handleGoogle = async () => {
        try {
            const res = await signInWithGoogle();
            console.log({ res });
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-xl w-96">
            <h1 className="text-gray-900 text-2xl mb-5">Sign In</h1>
            <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-gray-700 placeholder-gray-500"
            />
            <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 mb-4 bg-gray-100 rounded outline-none text-gray-700 placeholder-gray-500"
            />
    
            <Button 
            className="w-full my-1 bg-indigo-600 hover:bg-indigo-500"
            onClick={handleEmail}>
                Sign In
            </Button>
    
            <Button 
            className="w-full my-1 gap-2"
            variant="outline"
            onClick={handleGoogle}>
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                <span>Sign In with Google</span>
            </Button>
    
            <Button 
            className="w-full my-1"
            onClick={() => router.push('/sign-up')}>
                Sign Up
            </Button>
        </div>
        </div>
    );
};

export default SignIn;