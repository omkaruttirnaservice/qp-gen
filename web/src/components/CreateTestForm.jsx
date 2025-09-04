import { FaFloppyDisk } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { testsSliceActions } from '../Store/tests-slice';
import CButton from './UI/CButton';
import Input from './UI/Input';

function CreateTestForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { testDetails: test, errors } = useSelector((state) => state.tests);

    console.log(test, '=tes=');

    const createTestFormAutoSchema = Yup.object().shape({
        test_name: Yup.string().required('Test name required'),

        test_duration: Yup.number()
            .typeError('Test duration must be a number')
            .positive('Test duration must be greater than 0')
            .required('Test duration required'),

        marks_per_question: Yup.number()
            .typeError('Marks per question must be a number')
            .positive('Marks per question must be greater than 0')
            .required('Marks per question required'),

        test_passing_mark: Yup.number()
            .typeError('Passing marks must be a number')
            .min(1, 'Passing marks must be at least 1')
            .required('Passing marks required'),

        is_negative_marking: Yup.string().oneOf(['0', '1'], 'Invalid selection'),

        negative_mark: Yup.number()
            .typeError('Negative marks must be a number')
            .when('is_negative_marking', {
                is: '1',
                then: (schema) =>
                    schema
                        .positive('Negative marks must be greater than 0')
                        .required('Negative marks required'),
                otherwise: (schema) => schema.notRequired(),
            }),

        test_creation_type: Yup.string()
            .oneOf(['manual', 'auto'], 'Invalid test type')
            .required('Test type is required'),
    });

    const inputChangeHandler = (e) => {
        let { name, value } = e.target;

        dispatch(testsSliceActions.setTestDetailsOnChange({ key: name, value }));

        if (name === 'is_negative_marking') {
            value = value === '1' ? '1' : '0';

            if (value == '0') {
                let _newErrors = { ...errors };
                _newErrors.negative_mark = null;
                _newErrors.is_negative_marking = null;
                setTimeout(() => {
                    dispatch(testsSliceActions.setErrors(_newErrors));
                }, 1);
            }
        }
    };

    const createTestSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await createTestFormAutoSchema.validate({ ...test }, { abortEarly: false });

            dispatch(testsSliceActions.setTestDetailsFilled(true));
            dispatch(testsSliceActions.setErrors({}));

            if (test.test_creation_type == 'manual') {
                navigate('/tests/create/manual');
            } else if (test.test_creation_type == 'auto') {
                navigate('/tests/create/auto');
            } else {
                alert('No test mode selected');
            }
        } catch (error) {
            console.log(error);
            let __err = {};
            error.inner.forEach((el) => {
                __err[el.path] = el.message;
            });

            dispatch(testsSliceActions.setErrors(__err));

            dispatch(testsSliceActions.setTestDetailsFilled(false));
        }
    };

    return (
        <div>
            <form action="" id="create-test-form-auto" onSubmit={createTestSubmitHandler}>
                <div className="grid grid-cols-3 gap-6 mb-5">
                    <div className="relative">
                        <Input
                            value={test.test_name}
                            label={'Test name'}
                            name="test_name"
                            error={errors.test_name ? true : false}
                            onChange={inputChangeHandler}></Input>
                        {errors.test_name && <span className="error">{errors.test_name}</span>}
                    </div>

                    <div className="relative">
                        <Input
                            value={test.test_duration}
                            label={'Test duration'}
                            name="test_duration"
                            error={errors.test_duration ? true : false}
                            onChange={inputChangeHandler}></Input>

                        {errors.test_duration && (
                            <span className="error">{errors.test_duration}</span>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            value={test.marks_per_question}
                            label={'Marks per question'}
                            name="marks_per_question"
                            error={errors.marks_per_question}
                            onChange={inputChangeHandler}></Input>

                        {errors.marks_per_question && (
                            <span className="error">{errors.marks_per_question}</span>
                        )}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor=""
                            className="transition-all duration-300 text-gray-700 !mb-1  block">
                            Negative Marking
                        </label>
                        <select
                            name="is_negative_marking"
                            id=""
                            value={test.is_negative_marking}
                            onChange={inputChangeHandler}
                            className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>

                        {errors.is_negative_marking && (
                            <span className="error">{errors.is_negative_marking}</span>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            label={'Negative Marks'}
                            onChange={inputChangeHandler}
                            name={'negative_mark'}
                            value={test.is_negative_marking == 1 ? test.negative_mark : 0}
                            disabled={test.is_negative_marking != 1 ? true : false}
                        />

                        {errors.negative_mark && (
                            <span className="error">{errors.negative_mark}</span>
                        )}
                    </div>

                    <div className="relative">
                        <Input
                            value={test.test_passing_mark}
                            label={'Passing marks'}
                            name="test_passing_mark"
                            error={errors.test_passing_mark ? true : false}
                            onChange={inputChangeHandler}></Input>

                        {errors.test_passing_mark && (
                            <span className="error">{errors.test_passing_mark}</span>
                        )}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor=""
                            className="transition-all duration-300 text-gray-700 !mb-1  block">
                            Test Creation Type
                        </label>
                        <select
                            name="test_creation_type"
                            id="test-creation-type"
                            value={test.test_creation_type}
                            onChange={inputChangeHandler}
                            className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300">
                            <option value="manual" selected={test.test_creation_type == 'manual'}>
                                Manual
                            </option>
                            <option value="auto" selected={test.test_creation_type == 'auto'}>
                                Auto
                            </option>
                        </select>

                        {errors.test_creation_type && (
                            <span className="error">{errors.test_creation_type}</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <CButton type="submit" icon={<FaFloppyDisk />}>
                        Save
                    </CButton>
                </div>
            </form>
        </div>
    );
}

export default CreateTestForm;
