import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../utils/api';
import useStore from '../../store';

export default function Logout() {
    const [countdown, setCountdown] = useState(3);
    const { setIsAuthenticated } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown === 0) {
            navigate('/');
        }
    }, [countdown, navigate]);

    useEffect(() => {
        api.post('/auth/v1/logout', null, { withCredentials: true }).catch((error) => {
            console.error('Logout failed:', error);
        });
        setIsAuthenticated(false);
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logging out...</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Redirecting to homepage in <span className="font-semibold">{countdown}</span> second{countdown !== 1 && 's'}.
                </p>
            </div>
        </div>
    );
}
