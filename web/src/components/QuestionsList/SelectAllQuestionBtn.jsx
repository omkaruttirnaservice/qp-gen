import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice';
import CButton from '../UI/CButton';

function SelectAllQuestionBtn({ temp_QuestionList }) {
    const dispatch = useDispatch();

    const { selectedQuestionsList } = useSelector((state) => state.tests);

    const handleSelectAllQuestions = (e) => {
        const mergedUniqueQuestions = Array.from(
            new Set([...selectedQuestionsList, ...temp_QuestionList])
        );
        dispatch(testsSliceActions.setSelectedQuestionsList(mergedUniqueQuestions));
    };
    return (
        <>
            <CButton className={'btn--success'} onClick={handleSelectAllQuestions}>
                Select All
            </CButton>
        </>
    );
}

export default memo(SelectAllQuestionBtn);
