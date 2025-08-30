import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { _router } from './router';

function App() {
    return (
        <>
            <RouterProvider router={_router} />
        </>
    );
}

export default App;
