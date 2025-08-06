import { createSlice } from '@reduxjs/toolkit';
import { RESULT_BY_POST } from '../components/Utils/Constants';

const initialState = {
    examServerIP: null,
    testsList: [],

    testDetails: [],
    resultsList: [],

    studTestDetails: [],
    singleStudentViewReport: [], // this stores all details of single student result

    currentViewTestDetails: {
        viewResultBy: RESULT_BY_POST,
        selectedExamDate: null,
        selectedPost: null,
        studentResultList: [],
    }, // This will store details for test for which we are currently viewing result in /view-reports
};

const reportsSlice = createSlice({
    name: 'student-area-slice',
    initialState,
    reducers: {
        setExamServerIP: (state, action) => {
            state.examServerIP = action.payload;
        },

        setTestDetails: (state, action) => {
            state.testDetails = action.payload;
        },

        setTestsList: (state, action) => {
            state.testsList = action.payload;
        },

        setResultsList: (state, action) => {
            state.resultsList = action.payload;
        },

        setCurentViewTestDetails: (state, action) => {
            state.currentViewTestDetails = action.payload;
        },

        setSingleStudentViewReport: (state, action) => {
            state.singleStudentViewReport = action.payload;
            // if (action.payload?.studExam?.ptl_test_info) {
            // 	let [_testDetails] = JSON.parse(action.payload.studExam.ptl_test_info);
            // 	state.studTestDetails = _testDetails;
            // }
        },
    },
});

export const reportsAction = reportsSlice.actions;
export default reportsSlice;
