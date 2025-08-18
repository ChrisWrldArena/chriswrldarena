/* eslint-disable @next/next/no-img-element */
"use client";
import { useDialog } from "@/app/components/shared/dialog";
import { useAuth } from "@/app/contexts/AuthContext";
import { User } from "@/app/lib/interface";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Check, Edit, MoreVertical, Trash, User as EditUser } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 50;

const UsersClient = () => {
    const dialog = useDialog();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(true);
    const [currentPosition, setCurrentPosition] = useState<number>(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = PAGE_SIZE;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/user/?include=" + JSON.stringify({ subscriptions: true }));
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();

                setUsers(data);
            } catch {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (index: number, id: string) => {
        setCurrentPosition(index);
        dialog.showDialog({
            title: "Delete user",
            message: "Are you sure you want to delete this user? This action cannot be undone.",
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/user/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Failed to delete user");
                    setUsers(users.filter(pred => pred.id !== id));
                    setUpdating(false);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error deleting user:", error);
                }

            }
        })
    }
    const updateUser = async (index: number, user: User, data: string) => {
        setCurrentPosition(index);
        const { id, ...dataWithoutId } = user;
        dialog.showDialog({
            title: "Update user",
            message: `Are you sure you want to update this user to "${data}"?`,
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/user/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...dataWithoutId,
                            role: data,
                        }),
                    });
                    if (!response.ok) throw new Error("Failed to Update user");
                    const result = await response.json();

                    const updatedusers = [...users];
                    updatedusers[index] = {
                        ...updatedusers[index],
                        role: data as User['result'],
                    };
                    setUsers([
                        ...updatedusers
                    ])
                    setUpdating(false);
                    console.log("user updated successfully:", result);
                    // setusers(result);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error updating user:", error);
                }

            }
        })
    }

    const totalPages = Math.ceil(users.length / pageSize);
    const paginatedusers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-4 bg-white">
            <div className="sticky top-0 flex items-center justify-between bg-white border-b border-gray-200 z-10">

                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage this tall list of users.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/dashboard/users/create"
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700  focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
                        Add User
                    </Link>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="overflow-x-auto  ring-1 ring-neutral-300 ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country Info</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member since</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading ? (
                                <tr className="w-full">
                                    <td colSpan={7} className="text-center py-8 text-gray-500">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr className="w-full">
                                    <td colSpan={7} className="text-center py-8 text-gray-500">No users found.</td></tr>
                            ) : (
                                paginatedusers.map((user, i) => {
                                    const location = user.location ? JSON.parse(user.location) : {};
                                    return (
                                        <tr key={user.id}>
                                             <td className="px-4 py-2 whitespace-nowrap">
                                                {user.username}
                                            </td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <div className="inline-flex items-center">
                                                    <img
                                                        src={location.flag || "/default-avatar.png"}
                                                        alt={user.username}
                                                        className="h-6 w-6 rounded-full mr-2" />
                                                    {location.country} &bull; ({location.currencycode})
                                                    <br />
                                                    {location.region}
                                                </div>


                                            </td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.emailVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500"> {user.subscriptions?.length || "None"}</td>
                                             <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{moment(user.createdAt).format("LLL")}</td>
                                             {users.length > 0 && !loading && <td className="justify-end whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium">

                                                <Popover>
                                                    <PopoverTrigger className='max-w-lg w-full' asChild>
                                                        <MoreVertical
                                                            className="text-neutral-500 cursor-pointer hover:text-neutral-600 size-5 outline-0"
                                                            tabIndex={0}
                                                        />

                                                    </PopoverTrigger>
                                                    <PopoverContent align="end" className=" h-auto  bg-white z-50 rounded-lg border border-neutral-300 p-2 outline-0">

                                                        <button
                                                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => {
                                                                // Navigate to edit page
                                                                updateUser(i, user, user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                                                            }}
                                                        >
                                                            <EditUser className="w-4 h-4 text-neutral-500" />
                                                            {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                                                        </button>
                                                        <button
                                                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => {
                                                                // Navigate to edit page
                                                                window.location.href = `/dashboard/users/update/?id=${user.id}`;
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4 text-gray-500" />
                                                            Edit User
                                                        </button>
                                                        <button
                                                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            onClick={() => deleteUser(i, user.id)}
                                                        >
                                                            <Trash className="w-4 h-4 text-red-500" />
                                                            Delete User
                                                        </button>


                                                    </PopoverContent>
                                                </Popover>
                                            </td>}
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {users.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersClient;
