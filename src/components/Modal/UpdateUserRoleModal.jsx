import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'


const UpdateUserRoleModal = ({ isOpen, setIsOpen, role, userEmail }) => {

    const [updatedRole, setUpdatedRole] = useState(role)
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    function close() {
        setIsOpen(false)
    }

    // get data === useQuery
    // add/update/delete === useMutation


    const mutation = useMutation({
        mutationFn: async(role) => {
            const {data} = axiosSecure.patch(`/user/role/update/${userEmail}`, {role})
            return data;
        },
        onSuccess: (data) => {
            console.log(data);
            // refetch()
            queryClient.invalidateQueries(["users"])
            toast.success("Updated user role")
            setIsOpen(false)
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate(updatedRole)
    }


    return (
        <>


            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                Update User Role
                            </DialogTitle>

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <select
                                        value={updatedRole}
                                        onChange={e => setUpdatedRole(e.target.value)}
                                        name="role"
                                        className='w-full px-1 py-2 my-3 border rounded-xl'
                                    >
                                        <option value="">Select User Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="customer">Customer</option>
                                        <option value="seller">Seller</option>
                                    </select>
                                </div>

                                <div className='flex items-center justify-between mt-3'>
                                    <button type='submit' className='bg-green-400 py-2 px-4 rounded-lg cursor-pointer'>Update</button>
                                    <button type='button' onClick={close} className='bg-red-400 py-2 px-4 rounded-lg cursor-pointer'>Cancel</button>
                                </div>
                            </form>

                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
export default UpdateUserRoleModal;