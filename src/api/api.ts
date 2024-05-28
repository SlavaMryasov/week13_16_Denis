import axios from "axios"

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {
        'API-KEY': 'ce79cb97-503f-47ad-acea-165cf07d55d2'
    }
})

// const settings = {
//     withCredentials: true,
//     headers: {
//         'API-KEY': 'ce79cb97-503f-47ad-acea-165cf07d55d2'
//     }
// }


export const todolistApi = {
    getTodolists: () => {
        return instance.get<TodolistType[]>('/todo-lists')
    },
    postTodolist: (value: string) => {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title: value })
    },
    deleteTodolist: (todolistId: string) => {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    putTodolist: (todolistId: string, value: string) => {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title: value })
    }
}

type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}

type ResponseType<T = {}> = {
    data: T
    fieldErrors: string[]
    message: string[]
    resultCode: string
}
