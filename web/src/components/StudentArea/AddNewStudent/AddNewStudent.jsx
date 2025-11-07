import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaPencilAlt, FaPlus, FaRegClipboard, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import CModal from '../../UI/CModal.jsx';
import Input from '../../UI/Input.jsx';
import { writeToClipboard } from '../../Utils/utils.jsx';
import { deleteServerIP, getServerIP, postServerIP, updateServerIP } from './api.jsx';
import GetCentersListBtn from './GetCentersListBtn.jsx';
import GetStudentsListBtn from './GetStudentsListBtn.jsx';
import UploadQuestionPaperToFormFillingBtn from './UploadQuestionPaperToFormFillingBtn.jsx';
import DeleteIpBtn from './DeleteIpBtn.jsx';
import EditIpBtn from './EditIpBtn.jsx';

function AddNewStudent() {
    const [formFillingIpInputValue, setFormFillingIpInputValue] = useState('');

    const [ipDetails, setIpDetails] = useState({});

    const { formFillingIP } = useSelector((state) => state.studentArea);
    const dispatch = useDispatch();

    const {
        data: serverIP,
        error: getServerIPErr,
        isLoading: getServerIPLoading,
        isError,
        refetch: refetchServerIPList,
    } = useQuery({
        queryKey: ['getServerIP'],
        queryFn: getServerIP,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
    });

    useEffect(() => {
        toast.warn(getServerIPErr?.message);
    }, [isError, getServerIPErr]);

    useEffect(() => {
        if (serverIP) {
            dispatch(StudentAreaActions.setFormFillingIP(serverIP.data));
        }
    }, [serverIP]);

    const handleServerIpSubmit = (e) => {
        e.preventDefault();

        if (!ipDetails?.form_filling_server_ip)
            return toast.warn('Please enter Form Filling Server IP');
        if (!ipDetails?.exam_panel_server_ip) return toast.warn('Please enter Exam Panel IP');

        saveServerIP(ipDetails);
    };

    const {
        mutate: saveServerIP,
        isError: saveIpError,
        isPending: saveIpPending,
    } = useMutation({
        mutationFn: postServerIP,
        onSuccess: (data, variables) => {
            refetchServerIPList();
            toast.success('Successfully added form filling IP.');
            setIpDetails({});
            dispatch(ModalActions.toggleModal('add-process-url-modal'));
        },
        onError: (data) => {
            const er = data?.response?.data?.message || 'Server errror';
            toast.warn(er);
        },
    });

    const handleServerIpUpdate = (e) => {
        e.preventDefault();

        if (!ipDetails?.form_filling_server_ip)
            return toast.warn('Please enter Form Filling Server IP');
        if (!ipDetails?.exam_panel_server_ip) return toast.warn('Please enter Exam Panel IP');

        if (!ipDetails?.id) return toast.warn('Edit id not set.');

        updateServerIpMutation.mutate(ipDetails);
    };

    const updateServerIpMutation = useMutation({
        mutationFn: updateServerIP,
        onSuccess: (data, variables) => {
            refetchServerIPList();
            toast.success('Successfully updated form filling IP.');

            setIpDetails({});
            dispatch(ModalActions.toggleModal('edit-process-url-modal'));
        },
        onError: (data) => {
            const er = data?.response?.data?.message || 'Server errror';
            toast.warn(er);
        },
    });

    return (
        <>
            <div className="mt-5 flex flex-col gap-4">
                <div className="">
                    <table className="w-[100%]">
                        <thead>
                            <tr>
                                <th className="border p-2">Form Filling IP</th>
                                <th className="border p-2">Exam Panel IP</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formFillingIP?.length > 0 &&
                                formFillingIP.map((_el, idx) => {
                                    return (
                                        <tr>
                                            <td className="border p-2">
                                                <CButton
                                                    varient=""
                                                    className={`!bg-transparent !shadow-none !text-md !p-1 !inline-block !text-gray-500`}
                                                    icon={<FaRegClipboard />}
                                                    onClick={() =>
                                                        writeToClipboard(_el.form_filling_server_ip)
                                                    }>
                                                    <span>{_el.form_filling_server_ip}</span>
                                                </CButton>
                                            </td>
                                            <td className="border p-2">
                                                <CButton
                                                    varient=""
                                                    className={`!bg-transparent !shadow-none !text-md !p-1 !inline-block !text-gray-500`}
                                                    icon={<FaRegClipboard />}
                                                    onClick={() =>
                                                        writeToClipboard(_el.exam_panel_server_ip)
                                                    }>
                                                    <span>{_el.exam_panel_server_ip}</span>
                                                </CButton>
                                            </td>
                                            <td className="border p-2">
                                                <div className="flex gap-2">
                                                    <DeleteIpBtn id={_el.id} />
                                                    <EditIpBtn
                                                        _el={_el}
                                                        setIpDetails={setIpDetails}
                                                        ipDetails={ipDetails}
                                                    />

                                                    <GetCentersListBtn
                                                        form_filling_server_ip={
                                                            _el.form_filling_server_ip
                                                        }
                                                    />

                                                    <GetStudentsListBtn
                                                        form_filling_server_ip={
                                                            _el.form_filling_server_ip
                                                        }
                                                    />

                                                    {/* <GetStudentQuestionPaperBtn
                                                        form_filling_server_ip={
                                                            _el.form_filling_server_ip
                                                        }
                                                    /> */}

                                                    <UploadQuestionPaperToFormFillingBtn
                                                        _el={_el}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <CButton
                        icon={<FaPlus />}
                        onClick={() => {
                            dispatch(ModalActions.toggleModal('add-process-url-modal'));
                        }}
                        className={'btn--success text-xs mt-4'}>
                        Add New IP
                    </CButton>
                </div>
            </div>

            {/* add process url */}
            <CModal id="add-process-url-modal" title={'Add Process Url'}>
                <form action="" className="flex items-center gap-2" onSubmit={handleServerIpSubmit}>
                    <Input
                        type="url"
                        label={'Set Form Filling Server IP'}
                        name={'form_filling_server_ip'}
                        value={ipDetails.form_filling_server_ip}
                        onChange={(e) => {
                            setIpDetails((prev) => {
                                return {
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                };
                            });
                        }}></Input>
                    <Input
                        type="url"
                        label={'Set Exam Panel Server IP'}
                        name={'exam_panel_server_ip'}
                        value={ipDetails.exam_panel_server_ip}
                        onChange={(e) => {
                            setIpDetails((prev) => {
                                return {
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                };
                            });
                        }}></Input>
                    <CButton
                        type="submit"
                        className={'btn--danger self-end'}
                        isLoading={saveIpPending}>
                        Save
                    </CButton>
                </form>
            </CModal>

            {/* update process url */}
            <CModal id="edit-process-url-modal" title={'Update Process Url'}>
                <form action="" className="flex items-center gap-2" onSubmit={handleServerIpUpdate}>
                    <Input
                        type="hidden"
                        // label={'edit id'}
                        name={'edit_id'}
                        value={ipDetails?.id}></Input>

                    <Input
                        type="url"
                        label={'Set Form Filling Server IP'}
                        name={'form_filling_server_ip'}
                        value={ipDetails.form_filling_server_ip}
                        onChange={(e) => {
                            setIpDetails((prev) => {
                                return {
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                };
                            });
                        }}></Input>
                    <Input
                        type="url"
                        label={'Set Exam Panel Server IP'}
                        name={'exam_panel_server_ip'}
                        value={ipDetails.exam_panel_server_ip}
                        onChange={(e) => {
                            setIpDetails((prev) => {
                                return {
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                };
                            });
                        }}></Input>
                    <CButton
                        type="submit"
                        className={'btn--danger self-end'}
                        isLoading={saveIpPending}>
                        Update
                    </CButton>
                </form>
            </CModal>
        </>
    );
}

export default AddNewStudent;
