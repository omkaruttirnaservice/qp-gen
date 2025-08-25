import { FaEye, FaTrash, FaXmark } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getSearchFilters, getStudList } from './stud-list-api.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';

import DataTable from 'react-data-table-component';
import Input, { InputSelect } from '../../UI/Input.jsx';
import { s3BucketUrl, SEARCH_TYPE_NAME, SEARCH_TYPE_ROLL_NO } from '../../Utils/Constants.jsx';

function StudentsList() {
    const dispatch = useDispatch();
    const { allList, filters, searchData } = useSelector((state) => state.studentArea);
    const [filterStudentsList_All, setFilterStudentsList_All] = useState(allList.studentsList_ALL);

    useEffect(() => {
        console.log(allList);
        setFilterStudentsList_All(allList.studentsList_ALL);
    }, [allList.studentsList_ALL]);

    const {
        data: _studList,
        isError: getStudentListErr,
        isPending: getStudentsListPending,
        refetch: refetchStudentsList,
    } = useQuery({
        queryKey: ['getStudList'],
        queryFn: () =>
            getStudList({
                page: allList?.page || 1,
                limit: allList?.limit || 10,
                ...searchData,
            }),
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (_studList?.data) {
            console.log(_studList?.data, '=_studList?.data');
            dispatch(StudentAreaActions.setStudentsList_All(_studList?.data?.data));
        }
    }, [_studList]);

    const {
        data: _filters,
        isError: _filtersError,
        isPending: _filtersPending,
        refetch: _filtersRefetch,
    } = useQuery({
        queryKey: ['_filters'],
        queryFn: () => getSearchFilters(),
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (_filters?.data) {
            console.log(_filters?.data.data[0].filters, '=_filters?.data');
            let { center, post, exam_date, batch } = _filters?.data.data[0].filters;

            dispatch(
                StudentAreaActions.setFiltersData({
                    center: center.split(','),
                    post: post.split(','),
                    exam_date: exam_date.split(','),
                    batch: batch.split(','),
                })
            );
        }
    }, [_filters]);

    const handleSearch = (e) => dispatch(StudentAreaActions.setSearchTerm_ALL(e.target.value));

    const handleSearchFilterChange = (e) => {
        // dispatch(StudentAreaActions.setSearchTerm_ALL(''));
        // dispatch(StudentAreaActions.setSearchType_ALL(e.target.value));

        const updatedSearchData = {
            ...searchData,
        };

        updatedSearchData[e.currentTarget.name] = e.currentTarget.value;

        dispatch(StudentAreaActions.setSearchFilterValues(updatedSearchData));
    };

    useEffect(() => {
        if (allList.searchTerm == '') {
            refetchStudentsList();
            return;
        }

        let timeOut = setTimeout(() => refetchStudentsList(), 1500);

        return () => {
            if (timeOut) clearTimeout(timeOut);
        };
    }, [searchData.searchTerm]);

    const handlePageChange = (newPage) => {
        const candidateList = allList.studentsList_ALL;
        const pagination = {
            page: newPage,
            limit: allList.limit,
            totalRows: allList.totalRows,
            totalPages: allList.totalPages,
        };

        dispatch(StudentAreaActions.setStudentsList_All({ candidateList, pagination }));
    };

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        const candidateList = allList.studentsList_ALL;
        const pagination = {
            page: currentPage,
            limit: currentRowsPerPage,
            totalRows: allList.totalRows,
            totalPages: allList.totalPages,
        };

        dispatch(StudentAreaActions.setStudentsList_All({ candidateList, pagination }));
    };

    useEffect(() => {
        refetchStudentsList();
    }, [allList.page, allList.limit, searchData]);

    const columns = [
        {
            sortable: true,
            name: 'Name',
            cell: (row) => (
                <p className="flex items-center gap-2 justify-start">
                    <img
                        src={`${s3BucketUrl}/${row.sl_image}`}
                        alt=""
                        className="h-10 w-10 rounded-full hover:scale-[1.4] shadow-lg transition-all duration-300"
                    />
                    {row.sl_f_name + ' ' + row.sl_m_name + ' ' + row.sl_l_name}
                </p>
            ),
            width: '20rem',
        },
        {
            sortable: true,
            name: 'Roll No',
            selector: (row) => row.sl_roll_number,
            width: '6rem',
        },
        {
            sortable: true,
            name: 'Application No',
            selector: (row) => row.sl_application_number,
            width: '8rem',
        },
        {
            sortable: true,
            name: 'Date of birth',
            selector: (row) => row.sl_date_of_birth,
        },
        {
            sortable: true,
            name: 'Mobile number',
            selector: (row) => row.sl_contact_number,
            width: '8rem;',
        },
        { sortable: true, name: 'Category', selector: (row) => row.sl_catagory },
        {
            sortable: true,
            name: 'Physical handicap',
            selector: (row) => (row.sl_is_physical_handicap == 1 ? 'Yes' : 'No'),
        },
        { sortable: true, name: 'Post', selector: (row) => row.sl_post },
    ];

    return (
        <div className="">
            <div className="grid grid-cols-7 gap-3 mb-5 mt-3 items-center">
                <InputSelect
                    label={'Center'}
                    className={'w-fit'}
                    value={searchData.centerName}
                    name="centerName"
                    onChange={handleSearchFilterChange}>
                    <option value="">-- Select --</option>
                    {filters?.center?.length > 0 &&
                        filters.center.map((_el) => {
                            return <option value={_el}>{_el}</option>;
                        })}
                </InputSelect>

                <InputSelect
                    label={'Post'}
                    className={'w-fit'}
                    value={searchData.postName}
                    name="postName"
                    onChange={handleSearchFilterChange}>
                    <option value="">-- Select --</option>
                    {filters?.post?.length > 0 &&
                        filters.post.map((_el) => {
                            return <option value={_el}>{_el}</option>;
                        })}
                </InputSelect>

                <InputSelect
                    label={'Exam Date'}
                    className={' w-full'}
                    value={searchData.examDate}
                    name="examDate"
                    onChange={handleSearchFilterChange}>
                    <option value="">-- Select --</option>
                    {filters?.exam_date?.length > 0 &&
                        filters.exam_date.map((_el) => {
                            return <option value={_el}>{_el}</option>;
                        })}
                </InputSelect>

                <InputSelect
                    label={'Batch'}
                    className={' w-full'}
                    value={searchData.batch}
                    name="batch"
                    onChange={handleSearchFilterChange}>
                    <option value="">-- Select --</option>
                    {filters?.batch?.length > 0 &&
                        filters.batch.map((_el) => {
                            return <option value={_el}>{_el}</option>;
                        })}
                </InputSelect>

                <InputSelect
                    label={'Search Type'}
                    className={' w-full'}
                    value={searchData.searchType}
                    name="searchType"
                    onChange={handleSearchFilterChange}>
                    <option value="">-- Select --</option>
                    <option value={SEARCH_TYPE_ROLL_NO}>Roll No</option>
                    <option value={SEARCH_TYPE_NAME}>Name</option>
                </InputSelect>

                <Input
                    label={'Search'}
                    className={' w-full'}
                    value={searchData.searchTerm}
                    name="searchTerm"
                    onChange={handleSearchFilterChange}
                    disabled={searchData.searchType == ''}></Input>

                <CButton
                    className={'h-fit w-fit mt-auto'}
                    icon={<FaXmark />}
                    onClick={() => {
                        dispatch(StudentAreaActions.resetSearchFilterValues());
                    }}></CButton>
            </div>
            {filterStudentsList_All?.length >= 1 && (
                <DataTable
                    columns={columns}
                    data={filterStudentsList_All}
                    pagination
                    fixedHeader
                    highlightOnHover
                    paginationServer
                    paginationTotalRows={allList?.totalRows || 0}
                    paginationDefaultPage={allList?.page || 0}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Total Per Page',
                        rangeSeparatorText: '--',
                    }}></DataTable>
            )}

            {filterStudentsList_All?.length == 0 && !getStudentsListPending && (
                <p>Students not found...</p>
            )}
            {getStudentsListPending && <p>Getting students list...</p>}
            {getStudentListErr && <p>Error fetching students list...</p>}
        </div>
    );
}

export default StudentsList;
