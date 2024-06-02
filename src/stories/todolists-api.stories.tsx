import axios from "axios"
import { useEffect, useState } from "react"
import { v1 } from "uuid"


export default {
    title: 'API'
}


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {
        'API-KEY': '86733bb9-ad8a-4d47-8c3a-d6599f563d11'
    }
})

type TodoType = {
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
export const GetTodolists = () => {
    const [todolist, setTodolists] = useState<TodoType[]>([])
    useEffect(() => {
        instance.get<TodoType[]>('/todo-lists')
            .then(res => {
                // console.log(res)
                setTodolists(res.data)
            })
    }, [])
    return (
        <>
            {todolist.map(el => <div key={el.id}>{el.id}_____{el.title}</div>)}
        </>
    )
}
export const AddTodolist = () => {
    const [todolist, setTodolists] = useState<TodoType>()

    useEffect(() => {
        instance.post<ResponseType<{ item: TodoType }>>('todo-lists', { title: 'myTitle' })
            .then(res => setTodolists(res.data.data.item))
    }, [])
    return (
        <>
            {`добавлен тудушник с id: ${todolist?.id} и его тайтл ${todolist?.title}`}
        </>
    )
}

export const UpdateTodolist = () => {
    const [todolist, setTodolists] = useState<TodoType>()
    const changeableTodolistId = '6bc355ea-38b3-4f1b-9f63-69a153f8eb2b'
    useEffect(() => {
        instance.put(`todo-lists/${changeableTodolistId}`, { title: 'newTitdle' })
            .then(res => console.log(res))
    })

    return (
        <></>
    )
}


export const DeleteTodolist = () => {
    const [todolist, setTodolists] = useState<TodoType[]>([])
    let todoId = 'ad47e88f-1494-4f86-964f-cef1ad778389'

    useEffect(() => {
        instance.delete<ResponseType>(`/todo-lists/${todoId}`)
            .then(res => console.log(res))
    }, [])
    return (
        <>

        </>
    )
}