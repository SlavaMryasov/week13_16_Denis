import { Container } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './app/App';
import { store } from './app/store';
import { ErrorPage } from './components/ErrorPage/ErrorPage';
import { TodolistsList } from './features/TodolistsList/TodolistsList';
import { Login } from './features/login/Login';
import './index.css';
import reportWebVitals from './reportWebVitals';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Navigate to={'/404'} />,
        children: [
            {
                index: true, // за счет индекса реакт роутер дом понимает, что этот объект в приоритете
                element: <Navigate to={'/todolists'} />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/todolists",
                element: <Container fixed><TodolistsList /></Container>,
            },
            {
                path: "/404",
                element: <ErrorPage />,
            },
        ],
    },
    // {
    //     path: "/404",
    //     element: <ErrorPage />,
    // },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
