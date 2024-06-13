import { v1 } from 'uuid';
import { TodolistType, todolistsAPI } from '../api/todolists-api'
import { AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppRootStateType } from './store';

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodosType = ReturnType<typeof setTodosAC>

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodosType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOS': {
            return action.todos.map(tl => ({ ...tl, filter: 'all' }))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todo.id,
                title: action.todo.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => ({ type: 'REMOVE-TODOLIST', id: todolistId } as const)

export const addTodolistAC = (todo: TodolistType) =>
    ({ type: 'ADD-TODOLIST', todo } as const)

export const changeTodolistTitleAC = (id: string, title: string) =>
    ({ type: 'CHANGE-TODOLIST-TITLE', id: id, title: title } as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({ type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter } as const)

export const setTodosAC = (todos: TodolistType[]) =>
    ({ type: 'SET-TODOS', todos } as const)


export const getTodosTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists()
        .then(res => dispatch(setTodosAC(res.data)))
}
export const createTodoTC = (title: string): ThunkAction<void, AppRootStateType, unknown, ActionsType> => (dispatch) => {
    todolistsAPI.createTodolist(title)
        .then(res => dispatch(addTodolistAC(res.data.data.item)))
}

type TodoThunkType<ReturnType = void> = ThunkAction<void, AppRootStateType, unknown, ActionsType>
export const deleteTodoTC = (todoId: string): TodoThunkType => (dispatch) => {
    todolistsAPI.deleteTodolist(todoId)
        .then(res => dispatch(removeTodolistAC(todoId)))
}
export const changeTodoTitleTC = (todoId: string, title: string) => async (dispatch: Dispatch) => {
    const res = await todolistsAPI.updateTodolist(todoId, title)
    dispatch(changeTodolistTitleAC(todoId, title))
}

// export const changeTodoTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
//     todolistsAPI.updateTodolist(todoId, title)
//         .then(res => dispatch(changeTodolistTitleAC(todoId, title)))
// }

