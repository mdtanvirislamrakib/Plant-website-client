import React, { useEffect, useState } from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useRole = () => {

    const { user } = useAuth();
    const [role, setRole] = useState(null)
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchUserRole = async () => {
            if(!user) return setIsRoleLoading(false)
            try {
                const { data } = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/user/role/${user?.email}`)
                setRole(data?.role)
            } catch (error) {
                console.log(error);
            } finally {
                setIsRoleLoading(false)
            }

        }
        fetchUserRole();


    }, [user, axiosSecure])
    return [role, isRoleLoading];
};

export default useRole;