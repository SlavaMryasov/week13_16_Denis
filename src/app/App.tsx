import { Menu } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { logoutTC, meTC } from '../features/login/auth-reducer'
import './App.css'
import { RequestStatusType } from './app-reducer'
import { useAppDispatch, useAppSelector } from './store'
import { CircularProgress } from '@mui/material'


function App() {
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    const logOut = () => {
        dispatch(logoutTC())
    }

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(meTC())
    }, [])


    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="App">

            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn
                        // && <NavLink to={'/todolists'} color='inherit'>todos_</NavLink>
                        && <NavLink to={'/login'} color='inherit' onClick={logOut}>logout_</NavLink>
                    }
                    {!isLoggedIn && <NavLink to={'/login'} color='inherit'>login_</NavLink>}
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Outlet />
        </div>
    )
}

export default App
