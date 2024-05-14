import {createBrowserRouter} from 'react-router-dom';
import Login from './views/Login';
import Notfound from './views/NotFound';
import Home from './views/Home';


const router = createBrowserRouter([

    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '*',
        element: <Notfound />
    },
])

export default router; 