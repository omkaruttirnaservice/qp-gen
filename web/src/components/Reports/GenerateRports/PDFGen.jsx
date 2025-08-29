import { useRef, useState } from 'react';
import CButton from '../../UI/CButton';

const CIRCLE = 'CIRCLE';
const TEXT = 'TEXT';
const NUMBER = 'NUMBER';
const ROMAN = 'ROMAN';

const optionsInputEnum = [NUMBER, CIRCLE, TEXT, ROMAN];

const PDFGenerator = ({ questions, testDetails }) => {
    const _pdfConfig = {
        isShowCorrectAns: false,
        title: testDetails?.test_name || 'Title',
        isListView: true,
        duration: testDetails?.test_duration || 90,
        isNegativeMarking: testDetails?.is_negative_marking || false,
        negativeMarks: testDetails?.negative_mark || 0,
        examDate: '2025-01-01',
        totalQuestions: questions?.length || 0,

        isShowExtraConfig: true,
        optionInput: optionsInputEnum[0],
    };

    const printContainerRef = useRef(null);
    const [pdfConfig, setPdfConfig] = useState(_pdfConfig);

    const handlePrint = () => {
        if (printContainerRef?.current) {
            const printContent = printContainerRef.current.innerHTML;
            const printWindow = window.open('', '_blank', 'width=1080, height=1920');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print</title>
                        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <CButton onClick={handlePrint}>Print</CButton>

            <div className="grid grid-cols-3   gap-3 ">
                {/* Title Input */}
                <div>
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-sm"
                        placeholder="Title"
                        value={pdfConfig.title}
                        onChange={(e) =>
                            setPdfConfig((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>
                {/* add here */}

                {pdfConfig.isShowExtraConfig && (
                    <>
                        {/* Duration Input */}
                        <div>
                            <label className="block text-gray-700 mb-1">Duration (Minutes)</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full max-w-sm"
                                value={pdfConfig.duration}
                                onChange={(e) =>
                                    setPdfConfig((prev) => ({
                                        ...prev,
                                        duration: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>

                        {/* Exam Date Input */}
                        <div>
                            <label className="block text-gray-700 mb-1">Exam Date</label>
                            <input
                                type="date"
                                className="border rounded px-3 py-2 w-full max-w-sm"
                                value={pdfConfig.examDate}
                                onChange={(e) =>
                                    setPdfConfig((prev) => ({
                                        ...prev,
                                        examDate: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Negative Marking Toggle */}
                        <ToggleButtonUi
                            title={'Negative Marking'}
                            onClick={() => {
                                setPdfConfig((prev) => ({
                                    ...prev,
                                    isNegativeMarking: !prev.isNegativeMarking,
                                }));
                            }}
                            status={pdfConfig?.isNegativeMarking || false}
                        />

                        {/* Negative Marks Input */}
                        {pdfConfig.isNegativeMarking && (
                            <div>
                                <label className="block text-gray-700 mb-1">Negative Marks</label>
                                <input
                                    type="text"
                                    step="0.01"
                                    className="border rounded px-3 py-2 w-full max-w-sm"
                                    value={pdfConfig.negativeMarks}
                                    onChange={(e) =>
                                        setPdfConfig((prev) => ({
                                            ...prev,
                                            negativeMarks: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
                {/* Radio Buttons for View Type */}
                <div className="flex items-center space-x-6">
                    <span className="text-gray-700">View Type:</span>

                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="viewType"
                            value="list"
                            checked={pdfConfig.isListView}
                            onChange={() =>
                                setPdfConfig((prev) => ({
                                    ...prev,
                                    isListView: true,
                                }))
                            }
                            className="form-radio text-blue-600 focus:ring-blue-500"
                        />
                        <span>List View</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="viewType"
                            value="split"
                            checked={!pdfConfig.isListView}
                            onChange={() =>
                                setPdfConfig((prev) => ({
                                    ...prev,
                                    isListView: false,
                                }))
                            }
                            className="form-radio text-blue-600 focus:ring-blue-500"
                        />
                        <span>Split View</span>
                    </label>
                </div>
                {/* Toggle for Show Correct Answer */}
                <ToggleButtonUi
                    title={'Show Correct Option'}
                    onClick={() => {
                        setPdfConfig((prev) => ({
                            ...prev,
                            isShowCorrectAns: !prev.isShowCorrectAns,
                        }));
                    }}
                    status={pdfConfig?.isShowCorrectAns || false}
                />
                {/* Option Label Type */}
                <div>
                    <label className="block text-gray-700 mb-1">Option Label Type</label>
                    <select
                        className="border rounded px-3 py-2 w-full max-w-sm"
                        value={pdfConfig.optionInput}
                        onChange={(e) =>
                            setPdfConfig((prev) => ({
                                ...prev,
                                optionInput: e.target.value,
                            }))
                        }>
                        <option value={NUMBER}>Number (1, 2, 3)</option>
                        <option value={TEXT}>Text (A, B, C)</option>
                        <option value={ROMAN}>Roman (i, ii, iii)</option>
                        <option value={CIRCLE}>Circle (○)</option>
                    </select>
                </div>
            </div>

            {/* Component to be captured */}
            <div ref={printContainerRef}>
                <div className="p-4 bg-white shadow-md rounded-md w-full max-w-4xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">{pdfConfig.title}</h2>

                    {pdfConfig.isShowExtraConfig && (
                        <>
                            <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                                {/* Left column */}
                                <p>
                                    <strong>Exam Duration :</strong> {pdfConfig.duration} Minutes
                                </p>
                                <p>
                                    <strong>Total Questions :</strong> {pdfConfig.totalQuestions}
                                </p>

                                <p>
                                    <strong>Exam Date :</strong>{' '}
                                    {new Date(pdfConfig?.examDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Mark Per Question :</strong> 1
                                </p>
                                <p>
                                    <strong>Negative Marking :</strong>{' '}
                                    {pdfConfig.isNegativeMarking ? 'Yes' : 'No'}
                                </p>

                                {pdfConfig.isNegativeMarking && (
                                    <p>
                                        <strong>Negative Marks :</strong> {pdfConfig.negativeMarks}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    {/* List View */}
                    {pdfConfig.isListView && (
                        <div>
                            {questions.length > 0 &&
                                questions.map((q, idx) => (
                                    <QuestionUi key={idx} idx={idx} q={q} pdfConfig={pdfConfig} />
                                ))}
                        </div>
                    )}

                    {/* Split View */}
                    {!pdfConfig.isListView && (
                        <div className="columns-2">
                            {questions.length > 0 &&
                                questions.map((q, idx) => (
                                    <QuestionUi key={idx} idx={idx} q={q} pdfConfig={pdfConfig} />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function QuestionUi({ idx, q, pdfConfig }) {
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
                    <QuestionOption
                        idx={0}
                        option="A"
                        html={q?.q_a || q?.mqs_opt_one || '-'}
                        pdfConfig={pdfConfig}
                    />
                )}
                {(q?.q_b || q?.mqs_opt_two) && (
                    <QuestionOption
                        idx={1}
                        option="B"
                        html={q?.q_b || q?.mqs_opt_two || '-'}
                        pdfConfig={pdfConfig}
                    />
                )}
                {(q?.q_c || q?.mqs_opt_three) && (
                    <QuestionOption
                        idx={2}
                        option="C"
                        html={q?.q_c || q?.mqs_opt_three || '-'}
                        pdfConfig={pdfConfig}
                    />
                )}
                {(q?.q_d || q?.mqs_opt_four) && (
                    <QuestionOption
                        idx={3}
                        option="D"
                        html={q?.q_d || q?.mqs_opt_four || '-'}
                        pdfConfig={pdfConfig}
                    />
                )}
                {(q?.q_e || q?.mqs_opt_five) && (
                    <QuestionOption
                        idx={4}
                        option="E"
                        html={q?.q_e || q?.mqs_opt_five || '-'}
                        pdfConfig={pdfConfig}
                    />
                )}
            </div>

            {/* Correct Answer Toggle */}
            {pdfConfig.isShowCorrectAns && (
                <div className="mt-2 text-sm text-gray-800 border justify-center flex items-center gap-6">
                    <p>
                        Correct Answer:{' '}
                        <strong>
                            {q?.q_ans?.toUpperCase() || q?.mqs_ans?.toUpperCase() || '-'}
                        </strong>
                    </p>
                </div>
            )}
        </div>
    );
}

function QuestionOption({ option, html, pdfConfig, idx }) {
    // Generate label based on pdfConfig.optionInput
    const getOptionLabel = () => {
        switch (pdfConfig.optionInput) {
            case NUMBER:
                return (idx + 1).toString(); // 1,2,3...
            case TEXT:
                return String.fromCharCode(65 + idx); // A,B,C...
            case ROMAN:
                const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
                return romans[idx] || idx + 1;
            case CIRCLE:
                return ''; // Just a circle
            default:
                return option; // fallback
        }
    };

    return (
        <div className="flex items-start space-x-2">
            {/* Option label */}
            <span className="h-6 w-6 flex items-center justify-center border rounded-full border-gray-500 text-sm font-medium">
                {getOptionLabel()}
            </span>

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

function ToggleButtonUi({ title, onClick, status }) {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-gray-700">{title}</span>
            <button
                type="button"
                onClick={onClick}
                className={`w-8 h-4 flex items-center rounded-full transition-colors ${
                    status ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                <span
                    className={`w-3 h-2 bg-white rounded-full shadow transform transition-transform ${
                        status ? 'translate-x-4' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}

export default PDFGenerator;
