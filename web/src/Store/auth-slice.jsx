import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { getCookie } from '../components/Utils/utils';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // token: getCookie('token') || null,
        isAuthenticated: !!getCookie('username'),
        username: getCookie('username'),
        role: getCookie('role'),
        userId: getCookie('userId'), // optional future use
    },
    reducers: {
        login(state, action) {
            const { username, role, userId } = action.payload;
            // state.token = token;
            state.username = username;
            state.role = role;
            state.userId = userId;
            state.isAuthenticated = true;
            // Cookies.set('token', token, { expires: 7 });
            Cookies.set('username', username, { expires: 7 });
            Cookies.set('role', role, { expires: 7 });
            Cookies.set('userId', userId, { expires: 7 });
        },
        logout(state) {
            // state.token = null;
            state.username = null;
            state.role = null;
            state.userId = null;
            state.isAuthenticated = false;

            Cookies.remove('username');
            Cookies.remove('role');
            Cookies.remove('userId');
            // Cookies.remove('token');
        },
        setUser(state, action) {
            state.user = action.payload;
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice;
