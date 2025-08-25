import axios from 'axios';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getStudList = async ({ page = 1, limit = 1 }) => {
    console.log(page, limit, '-in here');
    const url = SERVER_IP + `/api/students-area/v2/all-list?page=${page}&limit=${limit}`;
    return await axios.get(url);
};
