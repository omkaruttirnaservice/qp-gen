import { FaBackspace, FaPrint } from 'react-icons/fa';
import { GoPencil } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../Hooks/use-http.jsx';

import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import {
    getQuestionsListThunk,
    getTestQuestionsListThunk,
    testsSliceActions,
} from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import { H2, H3 } from '../UI/Headings.jsx';
import EditQuestionView from './EditQuestionView.jsx';
import { EDIT_QUESTION_OF_GENERATED_TEST } from '../Utils/Constants.jsx';
import CModal from '../UI/CModal.jsx';
import PDFGenerator from '../Reports/GenerateRports/PDFGen.jsx';

const CIRCLE = 'CIRCLE';
const TEXT = 'TEXT';
const NUMBER = 'NUMBER';
const ROMAN = 'ROMAN';

const optionsInputEnum = [NUMBER, CIRCLE, TEXT, ROMAN];

function TestQuestionsView() {
    const { questionsList, testDetails } = useSelector((state) => state.tests);

    const { sendRequest } = useHttp();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (questionsList.length == 0) {
            dispatch(getQuestionsListThunk(testDetails.test_id, sendRequest, navigate));
        }
    }, [questionsList]);

    useEffect(() => {
        return () => {
            dispatch(testsSliceActions.cleanupPreviewTestDetails());
        };
    }, []);

    const handleEditQuestion = (el) => {
        dispatch(
            EditQuestionFormActions.setEditQuestionDetails({
                el,
                edit_for: EDIT_QUESTION_OF_GENERATED_TEST,
            })
        );
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

            <div className="container mx-auto text-center my-6 relative">
                <div
                    className="bg-blue-200 inline-block absolute left-0 top-0 p-2 cursor-pointer"
                    onClick={() => navigate(-1)}>
                    <FaBackspace />
                </div>

                <H2 className="mb-0">{testDetails.test_name}</H2>
            </div>
            <div className="container mx-auto grid grid-cols-3 gap-2 mb-6">
                <PreviewTestDetails title={'Test Duration'} value={testDetails.test_name} />

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

            {questionsList.length == 0 && (
                <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-2xl" />
                </div>
            )}

            <QuestionSplitView
                questionsList={questionsList}
                renderTopicHeader={renderTopicHeader}
                handleEditQuestion={handleEditQuestion}
            />
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
                                {topicHeader && (
                                    <div className="border p-2 text-center bg-green-300">
                                        {topicHeader}
                                    </div>
                                )}
                                <div
                                    className={`border transition-all duration-300  mb-5 shadow-sm bg-gray-100 relative que-container`}
                                    key={idx}>
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
