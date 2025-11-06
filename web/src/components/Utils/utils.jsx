import Cookies from 'js-cookie';
export const getCookie = (name) => Cookies.get(name);

export const isDevEnv = () =>
    import.meta.env.VITE_PROJECT_ENV === 'DEV' ||
    import.meta.env.VITE_PROJECT_ENV === 'development' ||
    import.meta.env.VITE_PROJECT_ENV === 'dev';
