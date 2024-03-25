'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebaseConfig'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const router = useRouter()

    const handleSignUp = async () => {
        try {
            const res = await createUserWithEmailAndPassword(email, password)
            console.log({res})
            setEmail('');
            setPassword('')
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
            <h1 className="text-gray-900 text-2xl mb-5">Sign Up</h1>
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
            onClick={handleSignUp}
            >
            Sign Up
            </Button>

            <Button 
            className="w-full my-1 gap-2"
            variant="outline"
            onClick={handleGoogle}>
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                <span>Sign Up with Google</span>
            </Button>

            <Button
            onClick={() => router.push('/sign-in')} 
            className="w-full my-1 "
            >
            Sign In
            </Button>
        </div>
        </div>
    );
};

export default SignUp;