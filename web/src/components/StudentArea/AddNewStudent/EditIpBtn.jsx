import { memo } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice';
import CButton from '../../UI/CButton';

function EditIpBtn({ ipDetails, setIpDetails, _el }) {
    const dispatch = useDispatch();

    return (
        <CButton
            icon={<FaPencilAlt />}
            onClick={() => {
                dispatch(ModalActions.toggleModal('edit-process-url-modal'));
                setIpDetails({
                    id: _el.id,
                    form_filling_server_ip: _el.form_filling_server_ip,
                    exam_panel_server_ip: _el.exam_panel_server_ip,
                });
            }}
            className={'btn--primary self-end'}
        />
    );
}

export default memo(EditIpBtn);
