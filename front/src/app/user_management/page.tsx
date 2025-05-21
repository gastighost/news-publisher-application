"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Author } from "@/types/author";
import { authApi } from "../../../lib/auth/user_auth";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import styles from "./user_management.module.css";

export default function UserManagementPage() {
    const [users, setUsers] = useState<Author[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const fetchedUsers = await authApi.getAllUsers();
            setUsers(fetchedUsers);
        } catch (err: any) {
            setError(err.message || "Failed to load users.");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUpdateStatus = async (
        userId: number,
        status: "ACTIVE" | "SUSPENDED" | "BLOCKED"
    ) => {
        setError(null);
        setSuccessMessage(null);
        try {
            await authApi.updateUserStatus(userId, status);
            setSuccessMessage(`User status updated to ${status} successfully!`);
            fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to update user status.");
            console.error("Error updating status:", err);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <main className={styles.container}>
                    <p className={styles.loadingText}>Loading users...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>
                    User Management
                </h1>
                {error && (
                    <p className={styles.errorText}>Error: {error}</p>
                )}
                {successMessage && (
                    <p className={styles.successText}>
                        {successMessage}
                    </p>
                )}
                <div className={styles.userList}>
                    {users.length === 0 && !error && <p className={styles.noUsersText}>No users found.</p>}
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={styles.userCard}
                        >
                            <h2 className={styles.userName}>{user.username}</h2>
                            <p className={styles.userInfo}>Email: {user.email}</p>
                            <p className={styles.userInfo}>
                                Status:{" "}
                                <span
                                    className={`${styles.status} ${styles[`status${user.userStatus}`]}`}
                                >
                                    {user.userStatus}
                                </span>
                            </p>
                            <p className={styles.userInfo}>Role: {user.type}</p>
                            <div className={styles.actions}>
                                {user.userStatus !== "ACTIVE" && (
                                    <button
                                        onClick={() => handleUpdateStatus(user.id, "ACTIVE")}
                                        className={`${styles.actionButton} ${styles.activateButton}`}
                                    >
                                        Activate
                                    </button>
                                )}
                                {user.userStatus !== "SUSPENDED" && (
                                    <button
                                        onClick={() => handleUpdateStatus(user.id, "SUSPENDED")}
                                        className={`${styles.actionButton} ${styles.suspendButton}`}
                                    >
                                        Suspend
                                    </button>
                                )}
                                {user.userStatus !== "BLOCKED" && (
                                    <button
                                        onClick={() => handleUpdateStatus(user.id, "BLOCKED")}
                                        className={`${styles.actionButton} ${styles.blockButton}`}
                                    >
                                        Block
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}