import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUser } from '@/app/lib/jwt';
import CreateUsersClient from './CreateUser';

export const metadata: Metadata = {
    title: 'Create User | ChrisWrldArena Dashboard',
    description: 'Create a new sports prediction',
};

export default async function CreateUsersPage() {
    const user = await getCurrentUser();
    const admin = user?.role === 'ADMIN';
    const session = user;

    if (!admin) {
        redirect('/');
    }
    if (!session) {
        redirect('/signin');
    }

    return (
        <div className="p-6 lg:p-4">
            <div className="flex items-center">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Users</h1>
                    <p className="text-gray-600 mt-1">Add a new sports prediction</p>
                </div>
                
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <CreateUsersClient />
            </div>
        </div>
    );
}
