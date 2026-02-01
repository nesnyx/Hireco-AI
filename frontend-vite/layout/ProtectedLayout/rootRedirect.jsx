import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RootRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');

        if (adminToken) {

            navigate('/admin/dashboard', { replace: true });
        } else if (userToken) {
            navigate('/dashboard/jobs', { replace: true });
        } else {
            navigate('/admin/login', { replace: true });
        }
    }, [navigate]);
    return <div>Loading...</div>;
};
