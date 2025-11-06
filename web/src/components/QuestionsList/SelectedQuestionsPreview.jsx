import { memo, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { confirmDialouge } from '../../helpers/confirmDialouge';
import { testsSliceActions } from '../../Store/tests-slice';
import CButton from '../UI/CButton';

function SelectedQuestionsPreview({ el, idx, topicHeader }) {
    const dispatch = useDispatch();
    const { selectedQuestionsList } = useSelector((state) => state.tests);
    const [isOpen, setIsOpen] = useState(false);
    const handleRemoveQuestion = async (el) => {
        const isConfirm = await confirmDialouge({
            title: 'Are you sure?',
            text: 'Do you want to delete the question?',
        });
        if (!isConfirm) return false;
        let updatedList = [...selectedQuestionsList];
        let index = selectedQuestionsList.findIndex((_el) => _el.q_id == el.q_id);
        updatedList.splice(index, 1);
        dispatch(testsSliceActions.setSelectedQuestionsList(updatedList));
    };
    return (
        <>
            {topicHeader && <div className="border p-2 text-center">{topicHeader}</div>}
            <div
                className={`border mb-2  overflow-y-hidden preview-question ${
                    isOpen ? 'h-auto' : 'h-[8rem]'
                } relative`}
                key={idx}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}>
                <CButton
                    icon={<FaTrash />}
                    onClick={handleRemoveQuestion.bind(null, el)}
                    className={'btn--danger absolute top-0 right-0 remove-que-btn'}>
                    Remove
                </CButton>
                <div className="py-3 px-4 text-start">
                    <div className="py-3 flex items-start gap-2">
                        <p className="font-bold text-[#555] mb-4  text-start inline-block">
                            Q. {el.q_id})
                        </p>
                        <p
                            className="text-start inline-block"
                            dangerouslySetInnerHTML={{
                                __html: el.q,
                            }}></p>
                    </div>

                    <div className="py-3">
                        <span className="font-bold text-[#555] mb-4 block text-start">
                            Option A
                        </span>

                        <p
                            dangerouslySetInnerHTML={{
                                __html: el.q_a,
                            }}></p>
                    </div>

                    <hr />

                    <div className="py-3">
                        <span className="font-bold text-[#555] mb-4 block text-start">
                            Option B
                        </span>

                        <p
                            dangerouslySetInnerHTML={{
                                __html: el.q_b,
                            }}></p>
                    </div>

                    <hr />

                    <div className="py-3">
                        <span className="font-bold text-[#555] mb-4 block text-start">
                            Option C
                        </span>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: el.q_c,
                            }}></p>
                    </div>

                    <hr />

                    <div className="py-3">
                        <span className="font-bold text-[#555] mb-4 block text-start">
                            Option D
                        </span>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: el.q_d,
                            }}></p>
                    </div>

                    <hr />

                    {el.q_e && (
                        <div className="py-3">
                            <span className="font-bold text-[#555] mb-4 block text-start">
                                Option E
                            </span>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: el.q_e,
                                }}></p>
                        </div>
                    )}

                    <hr />

                    <div className="py-3">
                        <span className="font-bold text-[#555] mb-4 me-3">Correct Option</span>
                        <span className="mb-6 bg-blue-200 px-2 py-1 w-fit">
                            {el.q_ans.toUpperCase()}
                        </span>
                    </div>

                    <hr />

                    {el.q_sol && (
                        <div className="py-3">
                            <span className="font-bold text-[#555] my-4 block text-start">
                                Solution
                            </span>
                            <p
                                className="text-start"
                                dangerouslySetInnerHTML={{
                                    __html: el.q_sol,
                                }}></p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(SelectedQuestionsPreview);
