'use client'

import { IUser } from '@/interface/userInterface';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table'; // Adjust import based on ShadCN's library
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const UsersManagement = () => {
    const [data, setData] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/user'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                console.log(result.data)
                setData(result.data); // Assuming the response is of type IUser
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs only once when the component mounts

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:4000/api/user/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) { return; }   
            const result = await response.json();
            console.log(result);
            setData(data.filter((user) => user._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto mt-10 shadow-md p-6 rounded-md bg-white">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold">User Management</h1>
                {/* Add a button to add a new user */}
                <Button>
                    <Link href="http://localhost:3000/users/createUser">Add User</Link>
                </Button>
            </div>
            {/* Table displaying user data */}
            {data && data.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Birthdate</TableHead>
                            <TableHead>Languages</TableHead>
                            <TableHead>Profile Image</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name ? user.name : 'N/A'}</TableCell>
                                <TableCell>{user.email ? user.email : 'N/A'}</TableCell>
                                <TableCell>{user.role ? user.role : 'N/A'}</TableCell>
                                <TableCell>{user.address ? user.address : 'N/A'}</TableCell>
                                <TableCell>{user.phone ? user.phone : 'N/A'}</TableCell>
                                <TableCell>{user.gender ? user.gender : 'N/A'}</TableCell>
                                <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{user.languages?.join(', ')}</TableCell>

                                <TableCell>
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={`${user.name} Profile`}
                                            className="w-16 h-16 object-cover rounded-full"
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell className='flex items-center space-x-2'>
                                    {/* Add action buttons here */}
                                    <button>
                                    <Link href={`http://localhost:3000/users/${user._id}`}> <Edit size={20}/></Link>
                                        
                                    </button>
                                    <button onClick={() => handleDelete(user._id as number)}>
                                       <Trash2 size={20}/>
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default UsersManagement;
