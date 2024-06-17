import { Dispatch } from 'redux'
import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
  setIsInitializedAC,
  SetIsInitializedType,
} from '../../app/app-reducer'
import { authAPI, LoginParamsType } from '../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'

const initialState = {
  isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {

    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value }
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: 'login/SET-IS-LOGGED-IN', value }) as const

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        // alert(`success! Your id: ${res.data.data.userId}`)
        dispatch(setIsLoggedInAC(true))
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(setAppStatusAC('succeeded'))
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const meTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.me().then(res => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true))
    } else {
      handleServerAppError(res.data, dispatch);
    }
    dispatch(setAppStatusAC('succeeded'))
  })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}


export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        // alert(`success! Your id: ${res.data.data.userId}`)
        dispatch(setIsLoggedInAC(false))
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(setAppStatusAC('succeeded'))
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | SetIsInitializedType