import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice';
import CButton from '../../UI/CButton';
import CModal from '../../UI/CModal';
import { getPublishedTestList, uploadPresentStudentsToFormFilling, uploadPublishedTestToFormFilling } from './api';

function UploadQuestionPaperToFormFillingBtn({ _el }) {
    const dispatch = useDispatch();

    const [publishedTestList, setPublishedTestList] = useState();

    const handleUploadQuestionPaperToFormFilling = () => {
        dispatch(ModalActions.toggleModal('published-test-list-modal'));
        getPublishedTestListQuery.refetch();
    };

    const getPublishedTestListQuery = useQuery({
        queryKey: ['Get-Published-Test-List'],
        queryFn: getPublishedTestList,
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    useEffect(() => {
        if (getPublishedTestListQuery?.data) {
            const list = getPublishedTestListQuery?.data?.data?.data || [];
            setPublishedTestList(list);
        }
    }, [getPublishedTestListQuery?.data]);

    const uploadPublishedTestToFormFillingMutation = useMutation({
        mutationFn: uploadPublishedTestToFormFilling,
        onSuccess: (data) => {
            console.log(data?.data?.message || 'Successful.', '==data==');
            toast.success(data?.data?.message || 'Successful.');
        },
        onError: (error) => {
            const er = error?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });

    const handleUploadToFormFilling = ({ published_test_id, ip_details }) => {
        if (!published_test_id) {
            toast.warn('Invalid published test id.');
            return;
        }
        if (!ip_details) {
            toast.warn('Invalid ip details.');
            return;
        }
        uploadPublishedTestToFormFillingMutation.mutate({
            _published_test_id: published_test_id,
            _ip_details: ip_details,
        });
    };

    const uploadPresentStudentsToFormFillingMutation = useMutation({
        mutationFn: uploadPresentStudentsToFormFilling,
        onSuccess: (data) => {
            console.log(data?.data?.message || 'Successful.', '==data==');
            toast.success(data?.data?.message || 'Successful.');
        },
        onError: (error) => {
            const er = error?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });

    const handleUploadPresentStudentsToFormFilling = ({ published_test_id, ip_details }) => {
        if (!published_test_id) {
            toast.warn('Invalid published test id.');
            return;
        }
        if (!ip_details) {
            toast.warn('Invalid ip details.');
            return;
        }
        uploadPresentStudentsToFormFillingMutation.mutate({
            _published_test_id: published_test_id,
            _ip_details: ip_details,
        });
    };

    return (
        <>
            <CButton
                className={'w-fit text-xs'}
                type="button"
                onClick={handleUploadQuestionPaperToFormFilling.bind(
                    null,
                    _el.exam_panel_server_ip,
                )}
                isLoading={false}>
                Upload Question Paper To FF
            </CButton>

            <CModal
                className={`!w-[90vw]`}
                id="published-test-list-modal"
                title={"Published Test's List"}>
                <table className="">
                    <thead>
                        <tr>
                            <th>Published Test ID</th>
                            <th>Test Name</th>
                            <th>Batch</th>
                            <th>Duration</th>
                            <th>Total Questions</th>
                            <th>Test Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publishedTestList &&
                            publishedTestList.map((_publishedTest) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{_publishedTest.id}</td>

                                            <td>{_publishedTest.mt_name}</td>
                                            <td>{_publishedTest.tm_allow_to}</td>
                                            <td>{_publishedTest.mt_test_time}</td>
                                            <td>{_publishedTest.mt_total_test_question}</td>
                                            <td>{_publishedTest.ptl_active_date}</td>
                                            <td>
                                                <CButton
                                                    icon={<FaUpload />}
                                                    isLoading={
                                                        uploadPublishedTestToFormFillingMutation.isPending
                                                    }
                                                    className={'text-xs'}
                                                    onClick={handleUploadToFormFilling.bind(null, {
                                                        published_test_id: _publishedTest.id,
                                                        ip_details: _el,
                                                    })}>
                                                    Upload To Form Filling
                                                </CButton>

                                                <CButton
                                                    icon={<FaUpload />}
                                                    isLoading={
                                                        uploadPublishedTestToFormFillingMutation.isPending
                                                    }
                                                    className={'text-xs'}
                                                    onClick={handleUploadPresentStudentsToFormFilling.bind(null, {
                                                        published_test_id: _publishedTest.id,
                                                        ip_details: _el,
                                                    })}>
                                                    Upload Present Students Attendance
                                                </CButton>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                    </tbody>
                </table>
            </CModal>
        </>
    );
}

export default memo(UploadQuestionPaperToFormFillingBtn);
