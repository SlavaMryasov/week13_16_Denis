import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';
import { ThunkDispatch, thunk } from 'redux-thunk';
import { useDispatch } from 'react-redux';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppDispatch = useDispatch<AppDispatchType>
// @ts-ignore
window.store = store;
