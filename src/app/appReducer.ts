export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
	isInitialized: false,
	status: 'idle' as RequestStatus,
	error: null as null | string,
}

type InitialState = typeof initialState

export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
	const { type, payload } = action
	switch (type) {
		case 'APP/SET-STATUS':
			return { ...state, status: payload.status }
		case 'APP/SET-ERROR':
			return { ...state, error: payload.error }
		case 'LOGIN/SET-IS-INITIALIZED':
			return { ...state, isInitialized: payload.isInitialized }
		default:
			return state
	}
}

export const setLoading = (status: RequestStatus) => ({ type: 'APP/SET-STATUS' as const, payload: { status } })
export const setError = (error: string | null) => ({ type: 'APP/SET-ERROR' as const, payload: { error } })
export const setIsInitialized = (isInitialized: boolean) => ({ type: 'LOGIN/SET-IS-INITIALIZED' as const, payload: { isInitialized } })

export type SetLoading = ReturnType<typeof setLoading>
export type SetError = ReturnType<typeof setError>
export type SetInitialized = ReturnType<typeof setIsInitialized>
type ActionsType = SetLoading | SetError | SetInitialized