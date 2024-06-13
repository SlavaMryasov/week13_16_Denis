import { TodolistsList } from '../features/TodolistsList/TodolistsList';
import './App.css';

// You can learn about the difference by reading this guide on minimizing bundle size.
// https://mui.com/guides/minimizing-bundle-size/
// import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppRootStateType, useAppSelector } from './store';
import { RequestStatusType } from './AppReducer';
import { CustomizedSnackbars } from '../components/ErrorSnackbar/ErrorSnackbar';


function App() {
    const appStatus = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {appStatus === 'loading' && <LinearProgress color="secondary" />}
            <Container fixed>
                <TodolistsList />
            </Container>
            <CustomizedSnackbars />
        </div>
    )
}

export default App
