import axios from "axios"

// за счет куки определяет кто я, а за счет api-key, есть ли у меня права доступа
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true, // говорим аксиусу что бы он проверил куки, здесь кука на авторизацию '.ASPXAUTH'
    headers: {
        'API-KEY': '86733bb9-ad8a-4d47-8c3a-d6599f563d11'
    }
})

export type TodoType = {
    addedDate: string
    id: string
    order: number
    title: string
}
type ResponseType<T = {}> = {
    resultCode: string
    messages: string[]
    fieldErrors: string[]
    data: T
}

export const todoApi = {
    getTodos: () => {
        return instance.get<TodoType[]>('/todo-lists')
    },
    addTodo: (title: string) => {
        return instance.post<ResponseType<{ item: TodoType }>>('todo-lists', { title })
    },
    updateTodo: (id: string, title: string) => {
        return instance.put(`todo-lists/${id}`, { title })
    },
    deleteTodo: (todoId: string) => {
        return instance.delete<ResponseType>(`/todo-lists/${todoId}`)
    }
}