import axios from 'axios';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getStudList = async ({ page = 1, limit = 1, search_term = '', search_by = '' }) => {
    let url = SERVER_IP + `/api/students-area/v2/all-list?page=${page}&limit=${limit}`;
    if (search_by != '' || search_by) url += `&search_by=${search_by}`;
    if (search_term != '' || search_term) url += `&search_term=${search_term}`;

    return await axios.get(url);
};
