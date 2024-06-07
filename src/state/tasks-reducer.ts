import { Dispatch } from 'redux';
import { TasksStateType } from '../App';
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType, todolistsAPI } from '../api/todolists-api';
import { AppRootStateType } from './store';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodosType } from './todolists-reducer';

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type SetTasksType = ReturnType<typeof setTasksAC>
export type UpdateTaskType = ReturnType<typeof updateTaskModule>


type ActionsType = RemoveTaskActionType | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosType
    | SetTasksType
    | UpdateTaskType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            return { ...state, [action.todoId]: action.tasks }
        }
        case 'SET-TODOS': {
            let stateCopy = { ...state }
            action.todos.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            return { ...state, [action.todoId]: state[action.todoId].filter(t => t.id !== action.taskId) }
        }
        case 'ADD-TASK': {
            return { ...state, [action.item.todoListId]: [action.item, ...state[action.item.todoListId]] }
        }
        case 'UPDATE-TASK': {
            return { ...state, [action.todoId]: state[action.todoId].map(t => t.id === action.taskId ? { ...t, ...action.model } : t) }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todo.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = { ...state };
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todoId: string) =>
    ({ type: 'REMOVE-TASK', taskId, todoId } as const)

export const addTaskAC = (item: TaskType) =>
    ({ type: 'ADD-TASK', item } as const)

export const setTasksAC = (tasks: TaskType[], todoId: string) =>
    ({ type: 'SET-TASKS', tasks, todoId } as const)

export const updateTaskModule = (todoId: string, taskId: string, model: UpdateTaskModelType) =>
    ({ type: 'UPDATE-TASK', todoId, taskId, model } as const)



export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todoId)
        .then(res => dispatch(setTasksAC(res.data.items, todoId)))
}
export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todoId, title)
        .then(res => dispatch(addTaskAC(res.data.data.item)))
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todoId, taskId)
        .then(res => dispatch(removeTaskAC(taskId, todoId)))
}

export const updateTaskTC = (taskId: string, todoId: string, modulePart: UpdateTaskModelPartType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks
    const task = tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...modulePart
        }
        todolistsAPI.updateTask(todoId, taskId, model)
            .then(res => dispatch(updateTaskModule(todoId, taskId, model)))
    }

}

export type UpdateTaskModelPartType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}