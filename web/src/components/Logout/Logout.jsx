import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../Store/auth-slice.jsx';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(authActions.logout());
        navigate('/login');
    }, [dispatch, navigate]);

    return <p className="text-center mt-10 text-gray-600">Logging you out...</p>;
}

export default Logout;
