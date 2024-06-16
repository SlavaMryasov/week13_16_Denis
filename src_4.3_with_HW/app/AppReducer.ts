
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type ActionsType = AppSetStatusType | SetErrorType

export type AppSetStatusType = ReturnType<typeof setAppStatusAC>
export type SetErrorType = ReturnType<typeof setErrorAC>

const initialState = {
    error: null as null | string,
    status: 'loading' as RequestStatusType,
}

type InitialStateType = typeof initialState

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'SET-ERROR':
            return { ...state, error: action.error }
        default:
            return state
    }
}




export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const)
export const setErrorAC = (error: string | null) => ({ type: 'SET-ERROR', error } as const)