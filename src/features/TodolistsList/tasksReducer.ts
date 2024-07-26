import { AddTodoListACType, DeleteTodoListACType, SetTodosACType } from "./todolistsReducer"
import { TaskPriorities, TaskStatuses, TaskType, todolistAPI, TodolistType, UpdateTaskModelType } from '../../api/todolistAPI'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../app/store'
import { RequestStatus, SetError, SetLoading, setLoading } from '../../app/appReducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { AxiosError } from 'axios'

const initialState: TasksStateType = {}

enum STATUS_CODE {
	SUCCESS = 0,
	ERROR = 1,
	RECAPTCHA_ERROR = 10,
}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
	const { type, payload } = action
	switch (type) {
		case 'SET-TODOLISTS':
			return payload.todolists.reduce((acc: TasksStateType, tl: TodolistType) => {
				acc[tl.id] = []
				return acc
			}, state)
		case 'SET-TASKS':
			return { ...state, [payload.todolistId]: payload.tasks.map(el => ({ ...el, entityStatus: 'idle' })) }
		case 'DELETE-TASK':
			return { ...state, [payload.todolistId]: state[payload.todolistId].filter(el => el.id !== payload.taskId) }
		case 'ADD-TASK':
			return { ...state, [payload.task.todoListId]: [{ ...payload.task, entityStatus: 'idle' }, ...state[action.payload.task.todoListId]] }
		case 'UPDATE-TASK':
			return {
				...state, [payload.todolistId]: state[payload.todolistId]
					.map(el => el.id === payload.taskId ? { ...el, ...payload.model } : el)
			}
		case 'CHANGE-ENTITY-TASK-STATUS':
			return {
				...state, [payload.todolistId]: state[payload.todolistId]
					.map(el => el.id === payload.taskId ? { ...el, entityTaskStatus: payload.entityTaskStatus } : el)
			}
		case 'ADD-TODOLIST':
			return { ...state, [payload.todolist.id]: [] }
		case 'DELETE-TODOLIST':
			const copyState = { ...state }
			delete copyState[payload.todolistId]
			return copyState
		default: return state
	}
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
	type: 'SET-TASKS' as const, payload: { todolistId, tasks }
})
export const deleteTaskAC = (todolistId: string, taskId: string) => ({
	type: 'DELETE-TASK' as const, payload: { todolistId, taskId }
})
export const addTaskAC = (task: TaskType) => ({
	type: 'ADD-TASK' as const, payload: { task }
})
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateTaskDomainModelType) => ({
	type: 'UPDATE-TASK' as const, payload: { todolistId, taskId, model }
})
export const changeEntityTaskStatus = (todolistId: string, taskId: string, entityTaskStatus: RequestStatus) => ({
	type: 'CHANGE-ENTITY-TASK-STATUS' as const, payload: { todolistId, entityTaskStatus, taskId }
})

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
	dispatch(setLoading('loading'))
	todolistAPI.getTasks(todolistId)
		.then((res) => {
			dispatch(setTasksAC(todolistId, res.data.items))
			dispatch(setLoading('succeeded'))
		})
		.catch((err) => {
			handleServerNetworkError(dispatch, err)
		})
}


export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
	dispatch(setLoading('loading'))
	todolistAPI.addTask(todolistId, title)
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(addTaskAC(res.data.data.item))
				dispatch(setLoading('succeeded'))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch((err: AxiosError) => {
			handleServerNetworkError(dispatch, err)
		})
}
export const deleteTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
	dispatch(changeEntityTaskStatus(todolistId, taskId, 'loading'))
	dispatch(setLoading('loading'))
	todolistAPI.deleteTask(todolistId, taskId)
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(deleteTaskAC(todolistId, taskId))
				dispatch(setLoading('succeeded'))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch((err) => {
			dispatch(changeEntityTaskStatus(todolistId, taskId, 'idle'))
			handleServerNetworkError(dispatch, err)
		})
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateTaskDomainModelType) =>
	(dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
		dispatch(setLoading('loading'))
		const task = getState().tasks[todolistId].find(el => el.id === taskId)
		if (task) {
			const apiModel: UpdateTaskModelType = {
				title: task.title,
				description: task.description,
				status: task.status,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				...domainModel
			}
			todolistAPI.updateTask(todolistId, taskId, apiModel)
				.then((res) => {
					if (res.data.resultCode === STATUS_CODE.SUCCESS) {
						dispatch(updateTaskAC(todolistId, taskId, domainModel))
						dispatch(setLoading('succeeded'))
					} else {
						handleServerAppError(dispatch, res.data)
					}
				})
				.catch((err) => {
					handleServerNetworkError(dispatch, err)
				})
		}

	}
export type TasksStateType = {
	[key: string]: TaskDomainType[]
}
export type TaskDomainType = TaskType & {
	entityStatus: RequestStatus
}
type ActionsType = ReturnType<typeof deleteTaskAC>
	| ReturnType<typeof addTaskAC>
	| AddTodoListACType
	| DeleteTodoListACType
	| SetTodosACType
	| ReturnType<typeof setTasksAC>
	| ReturnType<typeof deleteTaskAC>
	| ReturnType<typeof updateTaskAC>
	| SetLoading
	| SetError
	| ReturnType<typeof changeEntityTaskStatus>

type UpdateTaskDomainModelType = {
	title?: string
	description?: string
	status?: TaskStatuses
	priority?: TaskPriorities
	startDate?: string
	deadline?: string
}
