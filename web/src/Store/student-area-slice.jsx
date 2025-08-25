import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formFillingIP: null,
    allList: {
        studentsList_ALL: [],
        searchTerm: '',
        searchType: '',
        page: 1,
        limit: 10,
        totalRows: 0,
        totalPages: 0,
    },
    listByCenter: {
        studentsList_BY_CENTER: [],
        centersList_BY_CENTER: [],
        batchList_BY_CENTER: [],
        postsList_BY_CENTER: [],

        centerNumber: null,
        batchNumber: null,
        date: null,
    },
};

const studentAreaSlice = createSlice({
    name: 'student-area-slice',
    initialState,
    reducers: {
        setFormFillingIP: (state, action) => {
            state.formFillingIP = action.payload;
        },

        setSearchTerm_ALL: (state, action) => {
            state.allList.searchTerm = action.payload;
        },

        setSearchType_ALL: (state, action) => {
            state.allList.searchType = action.payload;
        },

        setStudentsList_All: (state, action) => {
            console.log(action.payload, '=payload');
            const _candidateList = action.payload?.candidateList || [];
            const { page, limit, total_rows, total_pages } = action.payload?.pagination;
            state.allList.studentsList_ALL = _candidateList;
            state.allList.page = page || 1;
            state.allList.limit = limit || 10;
            state.allList.totalRows = total_rows || 0;
            state.allList.totalPages = total_pages || 0;
        },

        setStudentsList_BY_CENTER: (state, action) => {
            state.listByCenter.studentsList_BY_CENTER = action.payload;

            let _uniquePostName = [...new Set(action.payload.map((item) => item.sl_post))];

            state.listByCenter.postsList_BY_CENTER = _uniquePostName;
        },

        setCentersList: (state, action) => {
            state.listByCenter.centersList_BY_CENTER = action.payload;
        },

        setBatchList: (state, action) => {
            state.listByCenter.batchList_BY_CENTER = action.payload;
        },

        setPostsList: (state, action) => {
            state.listByCenter.postsList_BY_CENTER = action.payload;
        },

        setStudentsByCenterSearch: (state, action) => {
            let { name, value } = action.payload;
            console.log(name, value, '==name, value==');
            state.listByCenter[name] = value;
        },
    },
});

export const StudentAreaActions = studentAreaSlice.actions;
export default studentAreaSlice;
