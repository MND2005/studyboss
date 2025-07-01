"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "./AuthProvider";
import { auth, signOut as firebaseSignOut } from "@/lib/firebase";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

const CurrentTime = () => {
    const [time, setTime] = useState({date: '', time: ''});

    useEffect(() => {
        const timerId = setInterval(() => {
            const now = new Date();
            setTime({
                date: now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-right hidden md:block">
            <div id="current-time" className="text-lg font-semibold tracking-wide text-foreground">{time.time || 'Loading...'}</div>
            <div id="current-date" className="text-sm text-muted-foreground">{time.date || 'Loading...'}</div>
        </div>
    )
}

export function Header() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 border-b mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground">
            Jeewana's Study Dashboard
        </h1>
        
        <div className="flex items-center gap-6">
            <CurrentTime />
            
            <div className="auth-container flex items-center gap-4">
                {loading ? (
                    <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
                ) : user ? (
                    <div id="user-display" className="flex items-center gap-3">
                        <Image 
                            id="user-avatar" 
                            src={user.photoURL || `https://placehold.co/40x40.png`} 
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full shadow-sm"
                            data-ai-hint="user avatar"
                        />
                        <div className="text-sm">
                            <div className="font-medium text-foreground">{user.displayName || user.email}</div>
                            <div className="text-muted-foreground">{user.email}</div>
                        </div>
                        <Button onClick={handleSignOut} variant="outline" size="icon" id="logout-button">
                            <LogOut className="h-4 w-4"/>
                            <span className="sr-only">Sign out</span>
                        </Button>
                    </div>
                ) : (
                    <Button asChild variant="outline" id="login-button">
                        <Link href="/login">
                            <LogIn /> Sign In
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    </header>
  );
}
