import { useMutation } from '@tanstack/react-query';
import CButton from '../../UI/CButton';
import { getStudentsList } from './api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { memo } from 'react';

function GetStudentsListBtn({ form_filling_server_ip }) {
    const getStudetListMutation = useMutation({
        mutationFn: getStudentsList,
        onSuccess: (data, variables) => {
            Swal.fire('Success', 'Downloaded students list');
        },
        onError: (error, variables) => {
            const er = error?.response?.data?.message || 'Server error.';
            if (er == 'Validation error') {
                Swal.fire('Error', 'Student data already present');
                return false;
            } else {
                toast.warn(er);
            }
        },
    });

    const handleGetStudentsList = (form_filling_server_ip) => {
        getStudetListMutation.mutate(form_filling_server_ip);
    };
    return (
        <CButton
            type="button"
            onClick={handleGetStudentsList.bind(null, form_filling_server_ip)}
            className={'w-fit text-xs'}
            isLoading={getStudetListMutation.isPending}>
            Get All Stuents List
        </CButton>
    );
}

export default memo(GetStudentsListBtn);
