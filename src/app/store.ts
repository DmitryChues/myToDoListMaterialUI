import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { tasksReducer } from "../features/TodolistsList/tasksReducer"
import { todolistReducer } from '../features/TodolistsList/todolistsReducer'
import { thunk, ThunkDispatch } from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { appReducer } from './appReducer'
import { authReducer } from '../features/Login/authReducer'

const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolist: todolistReducer,
	app: appReducer,
	auth: authReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store