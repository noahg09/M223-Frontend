"use client"

import {useState} from 'react'
import UserProfileForm from './UserProfileForm'
import styles from "./loginForm.module.css";
import FolderList from "@/app/folderList";

export default function LoginForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setError('');

        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: userName, password}),
        })
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('token', data.jwt);
                setIsLoggedIn(true);
            })
            .catch(error => setError(error || 'Login failed'));
    }

    if (isLoggedIn) {
        return <FolderList />
    } else {
        return (
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Sign In Form</h2>

                    <div className={styles.field}>
                        <label htmlFor="email">Username</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>sign in</button>
                </form>
            </div>
        )
    }
}