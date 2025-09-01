import EditAddQuestionForm from '../QuestionForm/EditQuestionForm.jsx';
import CModal from '../UI/CModal.jsx';

function EditQuestionView() {
    return (
        <>
            <CModal id="edit-que-modal" title={'Edit Question'} className={'!h-[97vh] !w-[97vw]'}>
                <EditAddQuestionForm />
            </CModal>
        </>
    );
}
export default EditQuestionView;
