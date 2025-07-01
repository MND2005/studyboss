"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import { useAuth } from "./AuthProvider";
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from "@/lib/firebase";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

const CurrentTime = () => {
    const [time, setTime] = useState({date: '', time: ''});

    useEffect(() => {
        const timerId = setInterval(() => {
            const now = new Date();
            setTime({
                date: now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-center absolute top-5 right-5 -translate-x-1/2 bg-black/50 p-2 px-4 rounded-lg border border-accent hidden md:block">
            <div id="current-date" className="text-sm">{time.date || 'Loading date...'}</div>
            <div id="current-time" className="text-lg font-bold tracking-widest">{time.time || 'Loading time...'}</div>
        </div>
    )
}

export function Header() {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <header className="flex justify-between items-center py-5 border-b-2 border-accent mb-8 relative flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-white relative pl-12" style={{textShadow: '0 0 10px #fff, 0 0 20px #fff'}}>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl opacity-70">忍</span>
            Jeewana's Study Dashboard
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl opacity-70 transform -scale-x-100 -mr-12">者</span>
        </h1>
        
        <CurrentTime />
        
        <div className="auth-container flex items-center gap-4">
            {loading ? (
                <div className="h-10 w-48 bg-gray-700 animate-pulse rounded-md"></div>
            ) : user ? (
                <div id="user-display" className="flex items-center gap-3">
                    <Image 
                        id="user-avatar" 
                        src={user.photoURL || `https://placehold.co/40x40.png`} 
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white shadow-md"
                        data-ai-hint="user avatar"
                    />
                    <span id="user-display-name" className="text-white">{user.displayName || user.email}</span>
                    <Button onClick={handleSignOut} variant="secondary" id="logout-button">
                        <LogOut /> Sign out
                    </Button>
                </div>
            ) : (
                <Button onClick={handleSignIn} variant="primary" id="login-button">
                    <LogIn /> Sign in with Google
                </Button>
            )}
        </div>
    </header>
  );
}
