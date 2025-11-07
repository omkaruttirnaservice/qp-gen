import { toast } from 'react-toastify';
import { getQuestionPaper } from './api';
import { useMutation } from '@tanstack/react-query';
import CButton from '../../UI/CButton';
import { memo } from 'react';

function GetStudentQuestionPaperBtn({ exam_panel_server_ip }) {
    const getQuestionPaperMutation = useMutation({
        mutationFn: getQuestionPaper,
        onSuccess: (data, variables) => {
            toast.success(data?.data?.message || 'Successful.');
        },
        onError: (error, variables) => {
            const er = error?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });

    function handleGetStudentsQuestionPaper(exam_panel_server_ip) {
        if (!exam_panel_server_ip) {
            toast.warn('Exam panel server IP not selected.');
            return false;
        }
        getQuestionPaperMutation.mutate(exam_panel_server_ip);
    }
    return (
        <CButton
            type="button"
            onClick={handleGetStudentsQuestionPaper.bind(null, exam_panel_server_ip)}
            className={'w-fit text-xs'}
            isLoading={false}>
            Get Student Question Paper
        </CButton>
    );
}

export default memo(GetStudentQuestionPaperBtn);
