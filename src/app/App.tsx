import React from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import { useAppSelector } from './store'
import { RequestStatusType } from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import { Menu } from '@mui/icons-material';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { Login } from '../features/login/Login'
import { NavLink, Outlet } from 'react-router-dom'


function App() {
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
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

                    <NavLink to={'/login'} color='inherit'>login_</NavLink>
                    <NavLink to={'/todolists'} color='inherit'>todos</NavLink>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Outlet />
        </div>
    )
}

export default App
