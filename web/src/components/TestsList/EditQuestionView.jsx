import EditAddQuestionForm from '../QuestionForm/EditQuestionForm.jsx';
import CModal from '../UI/CModal.jsx';

function EditQuestionView() {
    return (
        <>
            <CModal
                id="edit-que-modal"
                title={'Edit Question'}
                className={'h-[100vh] !w-[90vw] mt-4 overflow-auto !fixed'}>
                <EditAddQuestionForm />
            </CModal>
        </>
    );
}
export default EditQuestionView;
