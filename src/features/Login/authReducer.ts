import { Dispatch } from 'redux'
import { setIsInitialized, setLoading } from '../../app/appReducer'
import { authAPI } from '../../api/todolistAPI'
import { handleServerAppError, handleServerNetworkError } from '../../utils/errorUtils'
import { LoginType } from './Login'

const initialState = {
	isLoggedIn: false
}

type InitialState = typeof initialState
enum STATUS_CODE {
	SUCCESS = 0,
	ERROR = 1,
	RECAPTCHA_ERROR = 10,
}

export const authReducer = (state = initialState, action: ActionsType): InitialState => {
	const { type, payload } = action
	switch (type) {
		case 'LOGIN/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: payload.isLoggedIn }
		default:
			return state
	}
}

export const setIsLoggedInAC = (isLoggedIn: boolean) => ({ type: 'LOGIN/SET-IS-LOGGED-IN' as const, payload: { isLoggedIn } })

export const loginTC = (data: LoginType) => (dispatch: Dispatch) => {
	dispatch(setLoading('loading'))
	authAPI.login(data)
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
				dispatch(setLoading('succeeded'))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch((e) => {
			handleServerNetworkError(dispatch, e)
		})
}
export const meTC = () => (dispatch: Dispatch) => {
	dispatch(setLoading('loading'))
	authAPI.me()
		.then((res) => {
			if (res.data.resultCode === STATUS_CODE.SUCCESS) {
				dispatch(setIsLoggedInAC(true))
				dispatch(setLoading('succeeded'))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		})
		.catch((e) => {
			handleServerNetworkError(dispatch, e)
		})
		.finally(() => {
			dispatch(setIsInitialized(true))
		})
}

type ActionsType = ReturnType<typeof setIsLoggedInAC> 