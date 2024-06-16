import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType } from './todolists-reducer'
import { STATUS_CODE, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../app/store'
import { AppSetStatusType, RequestStatusType, SetErrorType, setAppStatusAC, setErrorAC } from '../../app/AppReducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import axios, { AxiosError } from 'axios'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return { ...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId) }
        case 'ADD-TASK':
            return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? { ...t, ...action.model } : t)
            }
        case 'ADD-TODOLIST':
            return { ...state, [action.todolist.id]: [] }
        case 'REMOVE-TODOLIST':
            const copyState = { ...state }
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = { ...state }
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return { ...state, [action.todolistId]: action.tasks.map(task => ({ ...task, entityStatus: 'idle' })) }
        case 'SET-TASK-STATUS':
            return {
                ...state, [action.todoId]: state[action.todoId].map(t => t.id === action.taskId
                    ? { ...t, entityStatus: action.status } : t)
            }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({ type: 'REMOVE-TASK', taskId, todolistId } as const)
export const addTaskAC = (task: TaskType) =>
    ({ type: 'ADD-TASK', task } as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({ type: 'UPDATE-TASK', model, todolistId, taskId } as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({ type: 'SET-TASKS', tasks, todolistId } as const)
export const setTaskStatusAC = (todoId: string, taskId: string, status: RequestStatusType) =>
    ({ type: 'SET-TASK-STATUS', todoId, taskId, status } as const)
// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const action = setTasksAC(tasks, todolistId)
            dispatch(action)
            dispatch(setAppStatusAC('succeeded'))

        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(setTaskStatusAC(todolistId, taskId, 'loading'))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
            const action = removeTaskAC(taskId, todolistId)
            dispatch(action)
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setTaskStatusAC(todolistId, taskId, 'idle'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    }
    catch (error) {
        if (axios.isAxiosError<ErrorType>(error)) {
            handleServerNetworkError(dispatch, error.response?.data!)
        } else {

        }

    }

    // .then(res => {
    //     if (res.data.resultCode === STATUS_CODE.SUCCESS) {
    //         const action = removeTaskAC(taskId, todolistId)
    //         dispatch(action)
    //         dispatch(setAppStatusAC('succeeded'))
    //         dispatch(setTaskStatusAC(todolistId, taskId, 'idle'))
    //     } else {
    //         handleServerAppError(dispatch, res.data)
    //     }
    // })
    // .catch((error) => {
    //     handleServerNetworkError(dispatch, error)
    // })
}

type ErrorType = {
    statusCode: number
    message: string
    error: string
}


export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === STATUS_CODE.SUCCESS) {
                const task = res.data.data.item
                const action = addTaskAC(task)
                dispatch(action)
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((error: AxiosError<ErrorType>) => {
            handleServerNetworkError(dispatch, error.response?.data!)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
                dispatch(setAppStatusAC('succeeded'))
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | AppSetStatusType
    | SetErrorType
    | ReturnType<typeof setTaskStatusAC>
