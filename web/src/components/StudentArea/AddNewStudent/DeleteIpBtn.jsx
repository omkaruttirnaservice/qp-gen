import { useMutation, useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CButton from '../../UI/CButton';
import { deleteServerIP, getServerIP } from './api';

function DeleteIpBtn({ id }) {
    const { refetch: refetchServerIPList } = useQuery({
        queryKey: ['getServerIP'],
        queryFn: getServerIP,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
    });
    // delete server ip
    function handleDeleteFormFillingIP(deleteId) {
        if (!deleteId) {
            toast.warn('No delete id found.');
            return false;
        }
        deleteFormFillingIPMutation.mutate(deleteId);
    }

    const deleteFormFillingIPMutation = useMutation({
        mutationFn: deleteServerIP,
        onSuccess: (data) => {
            refetchServerIPList();
            toast.success(data?.data?.message || 'Successful.');
        },
        onError: (data) => {
            const er = data?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });
    return (
        <CButton
            icon={<FaTrash />}
            onClick={handleDeleteFormFillingIP.bind(null, id)}
            className={'btn--danger self-end'}
        />
    );
}

export default memo(DeleteIpBtn);
