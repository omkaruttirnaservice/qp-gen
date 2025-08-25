import axios from 'axios';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getStudList = async ({ ...rest }) => {
    let url = SERVER_IP + `/api/students-area/v2/all-list`;

    let queryParamsInArray = Object.entries(rest);

    if (queryParamsInArray?.length > 0) {
        url += `?${queryParamsInArray[0][0]}=${encodeURIComponent(queryParamsInArray[0][1])}`;

        // remove first element cause we already added and we need question (?) mark in query string at start
        queryParamsInArray.shift();

        // add remaining query stirng if available
        if (queryParamsInArray?.length > 0) {
            for (let i = 0; i < queryParamsInArray.length; i++) {
                url += `&${queryParamsInArray[i][0]}=${encodeURIComponent(
                    queryParamsInArray[i][1]
                )}`;
            }
        }
    }

    return await axios.get(url);
};

export const getSearchFilters = async () => {
    let url = SERVER_IP + `/api/students-area/v1/student-search-page-filter`;
    return await axios.get(url);
};
