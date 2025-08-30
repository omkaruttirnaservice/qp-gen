import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaBackspace, FaPrint } from 'react-icons/fa';
import { GoPencil } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../Hooks/use-http.jsx';

import { useEffect, useState } from 'react';
import { FaListUl, FaSpinner } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { getQuestionsListThunk, testsSliceActions } from '../../Store/tests-slice.jsx';
import PDFGenerator from '../Reports/GenerateRports/PDFGen.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H2 } from '../UI/Headings.jsx';
import {
    EDIT_QUESTION_OF_GENERATED_TEST,
    EDIT_QUESTION_OF_PUBLISHED_TEST,
    TEST_LIST_MODE,
} from '../Utils/Constants.jsx';
import EditQuestionView from './EditQuestionView.jsx';
import { IoGridOutline } from 'react-icons/io5';

const _questionListView = {
    LIST: 'LIST',
    SPLIT: 'SPLIT',
    EXAM_THEME_1: 'EXAM_THEME_1',
};

function TestQuestionsView() {
    const [questionListView, setQuestionListView] = useState(_questionListView.SPLIT);

    const { questionsList, testDetails } = useSelector((state) => state.tests);

    const { sendRequest } = useHttp();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getQuestionsListThunk(testDetails.test_id, sendRequest, navigate));
    }, [testDetails.test_id]);

    useEffect(() => {
        return () => {
            dispatch(testsSliceActions.cleanupPreviewTestDetails());
        };
    }, []);

    const handleEditQuestion = (el) => {
        if (testDetails.mode == TEST_LIST_MODE.TEST_LIST) {
            dispatch(
                EditQuestionFormActions.setEditQuestionDetails({
                    el,
                    edit_for: EDIT_QUESTION_OF_GENERATED_TEST,
                })
            );
        }
        if (testDetails.mode == TEST_LIST_MODE.PUBLISHED_TEST_LIST) {
            dispatch(
                EditQuestionFormActions.setEditQuestionDetails({
                    el,
                    edit_for: EDIT_QUESTION_OF_PUBLISHED_TEST,
                })
            );
        }
        dispatch(ModalActions.toggleModal('edit-que-modal'));
    };

    let lastMainName = '';
    let lastSub = '';

    const renderTopicHeader = (mainTopicName, subTopicSection) => {
        let header = null;

        // Render sub topic header if it changes
        if (subTopicSection !== lastSub) {
            lastSub = subTopicSection;
            header = (
                <p className="topicDisplay">
                    {mainTopicName} :: {subTopicSection}
                </p>
            );
        }

        if (mainTopicName !== lastMainName) {
            lastMainName = mainTopicName;
        }

        return header;
    };

    return (
        <>
            <EditQuestionView />
            <CModal id={'view-pdf-modal'} title={'Questions Print List'} className={`min-w-[95vw]`}>
                <PDFGenerator questions={questionsList} testDetails={testDetails} />
            </CModal>

            <CButton
                className={'absolute bottom-5 right-5 z-30'}
                onClick={() => dispatch(ModalActions.toggleModal('view-pdf-modal'))}>
                <FaPrint />
            </CButton>

            <TestInfoHeader
                testDetails={testDetails}
                questionListView={questionListView}
                setQuestionListView={setQuestionListView}
            />

            {questionsList.length == 0 && (
                <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-2xl" />
                </div>
            )}

            {questionListView === _questionListView.SPLIT && questionsList.length !== 0 && (
                <QuestionSplitView
                    questionsList={questionsList}
                    renderTopicHeader={renderTopicHeader}
                    handleEditQuestion={handleEditQuestion}
                />
            )}

            {questionListView === _questionListView.EXAM_THEME_1 && questionsList.length !== 0 && (
                <ExamThemeView
                    questionsList={questionsList}
                    renderTopicHeader={renderTopicHeader}
                    handleEditQuestion={handleEditQuestion}
                />
            )}
        </>
    );
}

function TestInfoHeader({ testDetails, questionListView, setQuestionListView }) {
    function toggleListMode(mode) {
        setQuestionListView(mode);
    }

    return (
        <>
            <div className="container mx-auto text-center my-6 relative">
                <div
                    className="bg-blue-200 inline-block absolute left-0 top-0 p-2 cursor-pointer"
                    onClick={() => navigate(-1)}>
                    <FaBackspace />
                </div>

                <H2 className="mb-0">{testDetails.test_name}</H2>
            </div>

            <div className="border w-fit flex items-center h-fit justify-self-end">
                {/* View Toggle button */}
                <div
                    onClick={toggleListMode.bind(null, _questionListView.SPLIT)}
                    className={`${
                        questionListView == _questionListView.SPLIT ? 'bg-gray-200' : 'bg-white'
                    } p-3 cursor-pointer`}>
                    <FaListUl className="" />
                </div>
                <div
                    onClick={toggleListMode.bind(null, _questionListView.EXAM_THEME_1)}
                    className={`${
                        questionListView == _questionListView.EXAM_THEME_1
                            ? 'bg-gray-200'
                            : 'bg-white'
                    } p-3 cursor-pointer`}>
                    <IoGridOutline />
                </div>

                {/* Print buttons */}
                <div className="p-3 cursor-pointer" onClick={() => {}}>
                    <FaPrint />
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-3 gap-2 mb-6">
                <PreviewTestDetails title={'Test Duration'} value={testDetails.test_duration} />

                <PreviewTestDetails
                    title={'Marks per question'}
                    value={testDetails.marks_per_question}
                />

                <PreviewTestDetails title={'Total questions'} value={testDetails.total_questions} />

                <PreviewTestDetails
                    title={'Is negative marking'}
                    value={testDetails.is_negative_marking == 0 ? 'No' : 'Yes'}
                />

                <PreviewTestDetails
                    title={'Negative marks'}
                    value={testDetails.negative_mark == 0 ? 'No' : 'Yes'}
                />
                <PreviewTestDetails title={'Passing marks'} value={testDetails.test_passing_mark} />

                <PreviewTestDetails
                    title={'Test created date'}
                    value={testDetails.test_created_on}
                />

                <PreviewTestDetails title={'Todays date'} value={testDetails.todays_date} />
            </div>
        </>
    );
}

function QuestionSplitView({ questionsList, renderTopicHeader, handleEditQuestion }) {
    return (
        <>
            <div className="container mx-auto columns-2">
                {questionsList.length >= 1 &&
                    questionsList.map((el, idx) => {
                        const topicHeader = renderTopicHeader(
                            el.main_topic_name,
                            el.sub_topic_section
                        );
                        return (
                            <>
                                <div
                                    className={`border transition-all duration-300  mb-5 shadow-sm bg-gray-100 relative que-container`}
                                    key={idx}>
                                    {topicHeader && (
                                        <div className="border p-2 text-center bg-green-300">
                                            {topicHeader}
                                        </div>
                                    )}
                                    <CButton
                                        icon={<GoPencil />}
                                        onClick={handleEditQuestion.bind(null, el)}
                                        className={'absolute top-0 right-0 edit-que-btn'}>
                                        Edit
                                    </CButton>

                                    <QuestionUi q={el} idx={idx} />
                                </div>
                            </>
                        );
                    })}
            </div>
        </>
    );
}

function ExamThemeView({ questionsList, renderTopicHeader, handleEditQuestion }) {
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questionsList[idx]);

    useEffect(() => {
        setCurrentQuestion(questionsList[idx]);
    }, [idx]);

    const topicHeader = renderTopicHeader(
        currentQuestion?.main_topic_name || '-',
        currentQuestion?.sub_topic_section || '-'
    );

    useEffect(() => {
        dispatch(ModalActions.toggleModal('exam-theme-1-modal'));
    }, []);

    return (
        <CModal id="exam-theme-1-modal" title="Exam View" className="w-[97vw] h-[100lvh]">
            <div className="container mx-auto ">
                <div className="grid grid-cols-5 border ">
                    <div className="col-span-4">
                        <div
                            className={`border transition-all duration-300 mb-5 shadow-sm bg-gray-100 relative que-container `}
                            key={idx}>
                            {topicHeader && (
                                <div className="border p-2 text-center bg-green-300">
                                    {topicHeader}
                                </div>
                            )}

                            <QuestionUi q={currentQuestion} idx={idx} />

                            <div className="flex justify-between mx-6 mb-6">
                                <CButton
                                    disabled={idx == 0}
                                    className={'btn--success'}
                                    icon={<FaArrowAltCircleLeft />}
                                    onClick={() => setIdx((prev) => prev - 1)}>
                                    Prev
                                </CButton>
                                <CButton
                                    icon={<GoPencil />}
                                    onClick={handleEditQuestion.bind(null, currentQuestion)}
                                    className={'btn--success edit-que-btn'}>
                                    Edit
                                </CButton>
                                <CButton
                                    disabled={questionsList.length == idx + 1}
                                    icon={<FaArrowAltCircleRight />}
                                    onClick={() => setIdx((prev) => prev + 1)}>
                                    Next
                                </CButton>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="grid grid-cols-5 gap-3">
                            {questionsList.map((_q, _i) => {
                                return (
                                    <div
                                        className={`border size-8 flex items-center justify-center hover:bg-gray-300 cursor-pointer ${
                                            idx == _i ? 'bg-gray-600 text-white' : ''
                                        }`}
                                        onClick={() => setIdx(_i)}>
                                        {_i + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </CModal>
    );
}

function QuestionUi({ idx, q }) {
    return (
        <div className="border p-4 rounded-md shadow-sm break-inside-avoid mb-4">
            <div className="font-medium mb-2">
                Q {idx + 1}.{' '}
                <div
                    className="inline-block"
                    dangerouslySetInnerHTML={{
                        __html: q?.q || q?.mqs_question || '-',
                    }}
                />
            </div>

            {/* Options */}
            <div className="pl-4 space-y-1">
                {(q?.q_a || q?.mqs_opt_one) && (
                    <QuestionOption option="A" html={q?.q_a || q?.mqs_opt_one || '-'} />
                )}
                {(q?.q_b || q?.mqs_opt_two) && (
                    <QuestionOption option="B" html={q?.q_b || q?.mqs_opt_two || '-'} />
                )}
                {(q?.q_c || q?.mqs_opt_three) && (
                    <QuestionOption option="C" html={q?.q_c || q?.mqs_opt_three || '-'} />
                )}
                {(q?.q_d || q?.mqs_opt_four) && (
                    <QuestionOption option="D" html={q?.q_d || q?.mqs_opt_four || '-'} />
                )}
                {(q?.q_e || q?.mqs_opt_five) && (
                    <QuestionOption option="E" html={q?.q_e || q?.mqs_opt_five || '-'} />
                )}
            </div>

            <div className="mt-2 text-sm text-gray-800 border justify-center flex items-center gap-6">
                <p>
                    Correct Answer:{' '}
                    <strong>{q?.q_ans?.toUpperCase() || q?.mqs_ans?.toUpperCase() || '-'}</strong>
                </p>
            </div>
        </div>
    );
}

function QuestionOption({ option, html }) {
    return (
        <div className="flex gap-2 items-start space-x-2">
            {/* Option label */}
            <div className="">{option}.</div>

            {/* Option text */}
            <div
                className="inline-block"
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
}

function PreviewTestDetails({ title, value }) {
    return (
        <div className="flex gap-2 items-center">
            <span className="font-semibold">{title} :</span>
            <span>{value}</span>
        </div>
    );
}

export default TestQuestionsView;
