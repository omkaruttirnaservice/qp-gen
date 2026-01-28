import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../Store/auth-slice';
import useHttp from '../Hooks/use-http'; // adjust path if needed
import { SERVER_IP } from '../Utils/Constants';
import { isDevEnv } from '../Utils/utils';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            url: SERVER_IP + '/api/auth/login',
            method: 'POST',
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                dbConfig: selectedDb ? JSON.parse(selectedDb) : null,
            }),
        };

        sendRequest(requestData, (res) => {
            console.log({ res });
            if (res.success === 1) {
                const { username, role, id: userId } = res.data;

                dispatch(
                    authActions.login({
                        username: username,
                        role: role,
                        userId: userId,
                    })
                );
                navigate('/tests/list');
            } else {
                setError('Invalid login credentials');
            }
        });
    };

    const [selectedDb, setSelectedDb] = useState('');
    const [databases, setDatabases] = useState([]);
    // get databases list from backend on component mount
    useState(() => {
        const requestData = {
            url: SERVER_IP + '/api/auth/databases',
            method: 'GET',
        };

        sendRequest(requestData, (res) => {
            console.log({ res });
            if (res.success) {
                // handle databases list if needed
                console.log('Databases List:', res.data);
                setDatabases(res?.data || []);
            }
        });
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Select Database</label>
                    {databases.length > 0 && (
                        <select
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={selectedDb}
                            onChange={(e) => setSelectedDb(e.target.value)}
                            required>
                            <option value="">-- Select Database --</option>
                            {databases.map((db, index) => (
                                <option key={index} value={JSON.stringify(db)}>
                                    {db.processName} ({db.dbName})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
