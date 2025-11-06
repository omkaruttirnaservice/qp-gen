import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice';
import Input from '../UI/Input';
import CButton from '../UI/CButton';

function SelectRandomQuestion({ temp_QuestionList }) {
    const dispatch = useDispatch();

    const { selectedQuestionsList } = useSelector((state) => state.tests);
    const [randomQuestionCount, setRandomQuestionCount] = useState(0);
    const [isShowRandommInput, setIsShowRandomInput] = useState(false);

    const handleToggleSelectRandomQuestions = (e) => {
        setIsShowRandomInput(true);
    };

    const handleSetRandomQuestionCount = (e) => {
        if (isNaN(e.target.value)) {
            setRandomQuestionCount(0);
            return;
        }
        if (e?.target?.value > temp_QuestionList.length) {
            setRandomQuestionCount(temp_QuestionList.length);
        } else {
            setRandomQuestionCount(e?.target?.value || 0);
        }
    };

    const handleSelectRandomQuestions = (e) => {
        setIsShowRandomInput(false);
        if (randomQuestionCount === 0) return;
        setRandomQuestionCount(0);

        const randomQuestions = getRandomQuestions(randomQuestionCount);
        const mergedUniqueQuestions = Array.from(
            new Set([...selectedQuestionsList, ...randomQuestions])
        );
        dispatch(testsSliceActions.setSelectedQuestionsList(mergedUniqueQuestions));
    };

    const getRandomQuestions = (count) => {
        let randomIndexesSet = new Set();
        while (randomIndexesSet.size < count) {
            let randomIndex = Math.floor(Math.random() * temp_QuestionList.length);
            randomIndexesSet.add(randomIndex);
        }
        let randomQuestionsArray = [];
        randomIndexesSet.forEach((index) => {
            randomQuestionsArray.push(temp_QuestionList[index]);
        });
        return randomQuestionsArray;
    };

    return (
        <>
            <div className="text-xs cursor-pointer" onClick={handleToggleSelectRandomQuestions}>
                Select Random
            </div>

            {isShowRandommInput && (
                <>
                    <Input
                        className={'w-14'}
                        value={randomQuestionCount}
                        onChange={handleSetRandomQuestionCount}
                    />
                    <CButton onClick={handleSelectRandomQuestions}>Select</CButton>
                </>
            )}
        </>
    );
}

export default memo(SelectRandomQuestion);
