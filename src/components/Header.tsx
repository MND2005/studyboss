"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from "./AuthProvider";
import { auth, signOut as firebaseSignOut } from "@/lib/firebase";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
    <header className="flex justify-between items-center py-4 border-b mb-6">
        <h1 className="text-2xl font-bold text-foreground">
            {user ? `${user.displayName}'s Study Dashboard` : "Study Dashboard"}
        </h1>
        
        <div className="flex items-center gap-6">
            <CurrentTime />
            <div className="auth-container">
                {loading ? (
                    <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
                ) : user ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png`} data-ai-hint="user avatar" alt={user.displayName || 'User Avatar'} />
                                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <div className="font-medium text-foreground">{user.displayName || user.email}</div>
                                    <div className="text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                            <Button onClick={handleSignOut} variant="outline" size="icon" id="logout-button">
                                <LogOut className="h-4 w-4"/>
                                <span className="sr-only">Sign out</span>
                            </Button>
                        </div>
                        {/* Mobile View */}
                        <div className="flex md:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png`} data-ai-hint="user avatar" alt={user.displayName || 'User Avatar'} />
                                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                  </Avatar>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                  <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <span>Log out</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </>
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
