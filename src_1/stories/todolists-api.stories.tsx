import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { todolistApi } from '../api/api'

export default {
  title: 'API',
}



export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistApi.getTodolists()
      .then(response => setState(response.data))
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistApi.postTodolist('abracadabra')
      .then((response) => setState(response.data.data.item))
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = "bd8e0018-1171-4c02-a492-072a4dc2bf54"
  useEffect(() => {
    todolistApi.deleteTodolist(todolistId)
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "45f32d42-3e64-4539-9c4d-7650d0363eb7"
    todolistApi.putTodolist(todolistId, 'myTitle')
      .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}