import { useEffect, useState } from "react"
import { TodoType, todoApi } from "../api/api"


export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [todolist, setTodolists] = useState<TodoType[]>([])
    useEffect(() => {
        todoApi.getTodos()
            .then(res => {
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
        todoApi.addTodo('newTodo')
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
        todoApi.updateTodo(changeableTodolistId, 'updatedTitle')
            .then(res => console.log(res))
    })

    return (
        <></>
    )
}


export const DeleteTodolist = () => {
    const [todolist, setTodolists] = useState<TodoType[]>([])
    let todoId = '6bc355ea-38b3-4f1b-9f63-69a153f8eb2b'

    useEffect(() => {
        todoApi.deleteTodo(todoId)
            .then(res => console.log(res))
    }, [])
    return (
        <>

        </>
    )
}