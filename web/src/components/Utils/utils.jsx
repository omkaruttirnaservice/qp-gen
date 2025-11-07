import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
export const getCookie = (name) => Cookies.get(name);

export const isDevEnv = () =>
    import.meta.env.VITE_PROJECT_ENV === 'DEV' ||
    import.meta.env.VITE_PROJECT_ENV === 'development' ||
    import.meta.env.VITE_PROJECT_ENV === 'dev';

export const writeToClipboard = (text) => {
    navigator.clipboard.writeText(text);

    toast.success('Copied to clipbaord.');
};
