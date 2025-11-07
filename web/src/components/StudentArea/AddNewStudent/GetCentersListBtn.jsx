import React, { memo } from 'react';
import CButton from '../../UI/CButton';
import { useMutation } from '@tanstack/react-query';
import { getCentersList } from './api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function GetCentersListBtn({ form_filling_server_ip }) {
    const getCenterListMutation = useMutation({
        mutationFn: getCentersList,
        onSuccess: (data, variables) => {
            Swal.fire('Success', 'Downloaded centers list');
            toast.success(data?.data?.success || 'Successful.');
        },
        onError: (error, variables) => {
            const er = error?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });

    const handleGetCentersList = (form_filling_server_ip) => {
        getCenterListMutation.mutate(form_filling_server_ip);
    };
    return (
        <CButton
            type="button"
            onClick={handleGetCentersList.bind(null, form_filling_server_ip)}
            className={'w-fit text-xs'}
            isLoading={getCenterListMutation.isPending}>
            Get All Centers List
        </CButton>
    );
}

export default memo(GetCentersListBtn);
