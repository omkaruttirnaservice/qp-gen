import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice';

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
            <div className="text-xs cursor-pointer" onClick={handleSelectAllQuestions}>
                Select All
            </div>
        </>
    );
}

export default memo(SelectAllQuestionBtn);
