import { Menu } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AddItemForm } from './AddItemForm';
import './App.css';
import { Todolist } from './Todolist';
import { TaskStatuses, TaskType } from './api/todolists-api';
import { AppRootStateType, useAppDispatch } from './state/store';
import { createTaskTC, deleteTaskTC, updateTaskTC } from './state/tasks-reducer';
import {
    FilterValuesType,
    TodolistDomainType,
    changeTodoTitleTC,
    changeTodolistFilterAC,
    createTodoTC,
    deleteTodoTC,
    getTodosTC
} from './state/todolists-reducer';


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTodosTC())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(deleteTaskTC(todolistId, id))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(createTaskTC(todolistId, title))
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(id, todolistId, { status }))
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const action = updateTaskTC(id, todolistId, { title: newTitle });
        dispatch(action);
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodoTC(id))
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodoTitleTC(id, title))
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodoTC(title))
    }, [dispatch]);


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
            <Container fixed>
                <Grid container style={{ padding: '20px' }}>
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{ padding: '10px' }}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
