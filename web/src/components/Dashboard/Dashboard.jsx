import { FaListUl } from 'react-icons/fa6';
import { IoCreateOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CButton from '../UI/CButton.jsx';
import { H3 } from '../UI/Headings.jsx';

function Dashboard() {
    const navigate = useNavigate();

    const createTestHandler = () => navigate('/tests/create/form');
    const testsListHandler = () => navigate('/tests/list');
    const publishedTestsListHandler = () => navigate('/tests/published');

    return (
        <>
            <div className="container mt-6">
                <H3>Test Area</H3>
                <div className="flex gap-6">
                    <CButton className={'btn--info'} onClick={testsListHandler} icon={<FaListUl />}>
                        All Tests List
                    </CButton>

                    <CButton
                        className={'btn--danger'}
                        onClick={publishedTestsListHandler}
                        icon={<MdChecklist />}>
                        Published Tests List
                    </CButton>

                    <CButton onClick={createTestHandler} icon={<IoCreateOutline />}>
                        Create Test
                    </CButton>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
