import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import logo from "@/assets/logo.svg"
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { USER_STATUS } from "@/types/user"
import { SocketEvent } from "@/types/socket"

const LoginPage = () => {
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()
    const usernameRef = useRef<HTMLInputElement | null>(null)
    
    
    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }
    const login = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }
    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.password.trim().length === 0) {
            toast.error("Enter your password ")
            return false
        } else if (currentUser.password.trim().length < 5) {
            toast.error("Password  must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }


   
  

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-4 p-4 sm:w-[500px] sm:p-8">
            <img src={logo} alt="Logo" className="w-full"/>
            <form onSubmit={login} className="flex w-full flex-col gap-4">
                <input
                    type="text"
                    name="username"
                    placeholder="User Name"
                    className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.username}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.password}
                    ref={usernameRef}
                />
                <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-primary px-8 py-3 text-lg font-semibold text-black"
                >
                    Join
                </button>
            </form>
            <button
                className="cursor-pointer select-none underline"
                
            >
                Register as New User
            </button>
            <button
                className="cursor-pointer select-none underline"
               
            >
                Forgotten Password
            </button>
        </div>
    );
};

export default LoginPage;
