import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';
import { FaXmark } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import CButton from '../../UI/CButton.jsx';

function QuestionYearDropdown() {
    // prettier-ignore
    const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', ];
    const [years, setYears] = useState([]);

    const monthRef = useRef(null);
    const yearRef = useRef(null);

    useState(() => {
        let _y = [];

        let _currentYear = new Date().getFullYear();
        for (let i = _currentYear; i >= 2000; i--) {
            _y.push(i);
        }
        setYears(_y);
    }, []);
    const dispatch = useDispatch();
    const { data: _formData, errors } = useSelector((state) => state.questionForm);

	console.log(_formData,'=_formData');

    const handleChange = async (e) => {
        const _month = monthRef.current.value;
        const _year = yearRef.current.value;
        if (!_month || !_year) {
            return;
        }
        let updatedList = [..._formData.year];
        updatedList.push(`${_month} | ${_year}`);
        dispatch(
            EditQuestionFormActions.handleInputChange({
                key: 'year',
                value: updatedList,
            })
        );
        monthRef.current.value = '';
        yearRef.current.value = '';
    };

    function handleRemoveYear(_yearToRemove) {
        if (_formData.year.length === 0) return;
        let updatedList = _formData.year.filter((_el) => _el !== _yearToRemove);
        dispatch(
            EditQuestionFormActions.handleInputChange({
                key: 'year',
                value: updatedList,
            })
        );
    }

    // return (
    //     <div className="flex flex-col gap-1 relative">
    //         <label htmlFor="">Year</label>
    //         <div className="flex">
    //             <select className="input-el grow w-48" name="year" onChange={handleChange}>
    //                 <option value="" className="">
    //                     -- Select --
    //                 </option>
    //                 {years.length >= 1 &&
    //                     years.map((_y) => {
    //                         return (
    //                             <option value={_y} selected={_formData.year == _y ? true : false}>
    //                                 {_y}
    //                             </option>
    //                         );
    //                     })}
    //             </select>
    //         </div>

    //         {errors.month && <div className=" error">{errors.month}</div>}
    //     </div>
    // );

    return (
        <>
            <div className="flex flex-col gap-1 relative">
                <label htmlFor="" className="input-label">
                    Month
                </label>
                <div className="flex">
                    <select ref={monthRef} className="input-el grow w-48">
                        <option value="" className="">
                            -- Select --
                        </option>
                        {months.map((el, idx) => {
                            return (
                                <option key={idx} value={el}>
                                    {el}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-1 relative">
                <label htmlFor="" className="input-label">
                    Year
                </label>
                <div className="flex">
                    <select ref={yearRef} className="input-el grow w-48">
                        <option value="" className="">
                            -- Select --
                        </option>
                        {years?.length >= 1 &&
                            years.map((_y, idx) => {
                                return (
                                    <option key={idx} value={_y}>
                                        {_y}
                                    </option>
                                );
                            })}
                    </select>
                    <CButton onClick={handleChange} icon={<FaPlus />} />
                </div>
            </div>
            <div className="col-span-3 flex gap-1">
                {_formData?.year?.length > 0 &&
                    _formData?.year?.map((_el) => {
                        return (
                            <div className="relative ">
                                <span className="bg-yellow-300 p-2 rounded-full text-xs">
                                    {_el}
                                </span>
                                <FaXmark
                                    onClick={handleRemoveYear.bind(null, _el)}
                                    className="cursor-pointer w-4 h-4 bg-gray-200 rounded-full absolute right-0 top-[-0.4rem]"
                                />
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

export default QuestionYearDropdown;
