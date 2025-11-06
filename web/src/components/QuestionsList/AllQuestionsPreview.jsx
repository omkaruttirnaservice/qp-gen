import { useSelector } from 'react-redux';

function AllQuestionsPreview({ el, idx, handleAddQuestionToList }) {
    const { selectedQuestionsList } = useSelector((state) => state.tests);
    const isAdded = (id) => {
        return selectedQuestionsList.findIndex((el) => el.q_id == id);
    };
    return (
        <div
            className={`border mb-2 hover:bg-red-300 transition-all duration-300 overflow-y-scroll ${
                isAdded(el.q_id) != -1 ? 'selected-question' : ''
            }`}
            onClick={handleAddQuestionToList.bind(null, el)}
            key={idx}>
            <div className="py-3 px-4 text-start">
                <div className="py-3">
                    <p className="font-bold text-[#555] mb-4 block text-start">Q. {el.q_id})</p>
                    <p
                        className="text-start"
                        dangerouslySetInnerHTML={{
                            __html: el.q,
                        }}></p>
                </div>

                <div className="py-3">
                    <span className="font-bold text-[#555] mb-4 block text-start">Option A</span>

                    <p
                        dangerouslySetInnerHTML={{
                            __html: el.q_a,
                        }}></p>
                </div>

                <hr />

                <div className="py-3">
                    <span className="font-bold text-[#555] mb-4 block text-start">Option B</span>

                    <p
                        dangerouslySetInnerHTML={{
                            __html: el.q_b,
                        }}></p>
                </div>

                <hr />

                <div className="py-3">
                    <span className="font-bold text-[#555] mb-4 block text-start">Option C</span>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: el.q_c,
                        }}></p>
                </div>

                <hr />

                <div className="py-3">
                    <span className="font-bold text-[#555] mb-4 block text-start">Option D</span>
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
    );
}

export default AllQuestionsPreview;
