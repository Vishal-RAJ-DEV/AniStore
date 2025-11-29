import { useEffect, useState } from "react"
import { useGetusersQuery, useDeleteuserMutation, useUpdateUserMutation } from "../../redux/api/userApiSlice"
import { toast } from 'react-toastify'
import Loader from "../../components/Loader"
import Message from "../../components/Message"
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUser } from 'react-icons/fa'

const UserList = () => {
    const { data: users, isLoading, refetch, error } = useGetusersQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteuserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserName, setEditableUserName] = useState('');
    const [editableUserEmail, setEditableUserEmail] = useState('');

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    useEffect(() => {
        refetch();
    }, [refetch])

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id).unwrap();
                refetch();
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error || 'Error deleting user');
            }
        }
    }

    const toggleEdit = (user) => {
        if (editableUserId === user._id) { 
            // Cancel edit
            setEditableUserId(null);
            setEditableUserName('');
            setEditableUserEmail('');
        } else {
            // Enable edit
            setEditableUserId(user._id);
            setEditableUserName(user.username);
            setEditableUserEmail(user.email);
        }
    }

    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId: id,
                username: editableUserName,
                email: editableUserEmail
            }).unwrap();
            
            setEditableUserId(null);
            refetch();
            toast.success('User updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'Error updating user');
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-white">User Management</h1>
            
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="error">{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-[#1e1e1e] rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-center">Admin</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users?.map(user => (
                                    <tr key={user._id} className="hover:bg-[#2a2a2a]">
                                        <td className="py-3 px-4 text-gray-300 text-sm">{user._id}</td>
                                        
                                        <td className="py-3 px-4">
                                            {editableUserId === user._id ? (
                                                <div className="flex items-center">
                                                    <input 
                                                        type="text" 
                                                        value={editableUserName} 
                                                        onChange={(e) => setEditableUserName(e.target.value)}
                                                        className="bg-gray-800 text-white rounded px-2 py-1 text-sm w-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <FaUser className="text-[#ff6b9d] mr-2" />
                                                    <span className="text-white">{user.username}</span>
                                                </div>
                                            )}
                                        </td>
                                        
                                        <td className="py-3 px-4">
                                            {editableUserId === user._id ? (
                                                <input 
                                                    type="email" 
                                                    value={editableUserEmail} 
                                                    onChange={(e) => setEditableUserEmail(e.target.value)}
                                                    className="bg-gray-800 text-white rounded px-2 py-1 text-sm w-full"
                                                />
                                            ) : (
                                                <span className="text-white">{user.email}</span>
                                            )}
                                        </td>
                                        
                                        <td className="py-3 px-4 text-center">
                                            {user.isAdmin ? (
                                                <FaCheck className="mx-auto text-green-500" />
                                            ) : (
                                                <FaTimes className="mx-auto text-red-500" />
                                            )}
                                        </td>
                                        
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {editableUserId === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateHandler(user._id)}
                                                            disabled={isUpdating}
                                                            className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white p-2 rounded hover:opacity-90 transition-opacity"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleEdit(user)}
                                                            className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleEdit(user)}
                                                        className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}
                                                
                                                <button
                                                    onClick={() => deleteHandler(user._id)}
                                                    disabled={isDeleting || user.isAdmin}
                                                    className={`p-2 rounded ${
                                                        user.isAdmin 
                                                            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                                            : 'bg-red-600 hover:bg-red-700'
                                                    }`}
                                                >
                                                    <FaTrash className="text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default UserList