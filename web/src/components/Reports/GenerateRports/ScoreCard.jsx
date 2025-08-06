import {
    FiCheckCircle,
    FiXCircle,
    FiPercent,
    FiList,
    FiBookOpen,
    FiClock,
    FiCalendar,
    FiAlertTriangle,
    FiTarget,
} from 'react-icons/fi';
import { H3 } from '../../UI/Headings.jsx';

function ScoreCard({ studExam }) {
    if (!studExam) return <div className="text-center text-sm text-red-600">No data available</div>;

    const correctMarks = +studExam.sfrs_correct * +studExam.mt_mark_per_question;
    const negativeMarks =
        +studExam.mt_is_negative === 1 ? +studExam.sfrs_wrong * +studExam.mt_negativ_mark : 0;
    const gainPercent = ((+studExam.sfrs_marks_gain / +studExam.sfrc_total_marks) * 100).toFixed(2);
    const isPass = +studExam.sfrs_marks_gain >= +studExam.mt_passing_out_of;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <H3 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Score Card</H3>

            {/* Dashboard-style highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <HighlightCard
                    icon={<FiTarget className="text-indigo-600" size={28} />}
                    label="Final Score"
                    value={`${studExam.sfrs_marks_gain} / ${studExam.sfrc_total_marks}`}
                    color="text-indigo-600"
                />
                <HighlightCard
                    icon={
                        isPass ? (
                            <FiCheckCircle className="text-green-600" size={28} />
                        ) : (
                            <FiXCircle className="text-red-600" size={28} />
                        )
                    }
                    label="Result"
                    value={isPass ? 'PASS' : 'FAIL'}
                    color={isPass ? 'text-green-600' : 'text-red-600'}
                />
                <HighlightCard
                    icon={<FiPercent className="text-blue-600" size={28} />}
                    label="Gain %"
                    value={`${gainPercent}%`}
                    color="text-blue-600"
                />
            </div>

            {/* Detailed section: 2-column grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Attempt Summary */}
                <DetailCard title="Attempt Summary" icon={<FiList size={20} className="" />}>
                    <DetailRow
                        label="Correct"
                        value={studExam.sfrs_correct}
                        color="text-green-600"
                    />
                    <DetailRow label="Wrong" value={studExam.sfrs_wrong} color="text-red-600" />
                    <DetailRow label="Unattempted" value={studExam.sfrs_unattempted} />
                    <DetailRow
                        label="Total Solved"
                        value={+studExam.sfrs_correct + +studExam.sfrs_wrong}
                        color="text-blue-600"
                    />
                    <DetailRow
                        label="Time Taken"
                        value={`${studExam.sfrs_rem_min} Min ${studExam.sfrs_rem_sec} Sec`}
                    />
                </DetailCard>

                {/* Test Information */}
                <DetailCard title="Test Info" icon={<FiBookOpen size={20} className="" />}>
                    <DetailRow label="Exam Name" value={studExam.mt_name} />
                    <DetailRow label="Date" value={studExam.mt_added_date} />
                    <DetailRow label="Total Questions" value={studExam.mt_total_test_question} />
                    <DetailRow label="Time Allowed" value={`${studExam.mt_test_time} Min`} />
                    <DetailRow label="Passing Marks" value={studExam.mt_passing_out_of} />
                    <DetailRow label="Mark per Question" value={studExam.mt_mark_per_question} />
                    <DetailRow
                        label="Negative Marking"
                        value={+studExam.mt_is_negative === 1 ? 'Yes' : 'No'}
                        color={+studExam.mt_is_negative === 1 ? 'text-red-500' : 'text-gray-700'}
                    />
                    <DetailRow label="Correct Marks" value={correctMarks} color="text-green-700" />
                    <DetailRow label="Negative Marks" value={negativeMarks} color="text-red-500" />
                </DetailCard>
            </div>
        </section>
    );
}

// Highlight cards (top of dashboard)
function HighlightCard({ icon, label, value, color }) {
    return (
        <div className="flex items-center gap-4 bg-white p-5 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition">
            <div className="p-3 rounded-full bg-gray-100">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <h4 className={`text-xl font-bold ${color}`}>{value}</h4>
            </div>
        </div>
    );
}

// Card layout for section
function DetailCard({ title, icon, children }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">{icon}</div>
                <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

// Detail row
function DetailRow({ label, value, icon = null, color = 'text-gray-800' }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md shadow-sm hover:bg-white transition">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {icon}
                <span>{label}</span>
            </div>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

export default ScoreCard;
