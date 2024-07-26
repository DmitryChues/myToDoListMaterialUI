import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppDispatch, useAppSelector } from './store'
import { RequestStatus } from './appReducer'
import CustomizedSnackbars from '../components/ErrorSnackbar/ErrorSnackbar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { meTC } from '../features/Login/authReducer'
import CircularProgress from '@mui/material/CircularProgress'

export type FilterValuesType = "all" | "active" | "completed"

export type TaskType = {
	id: string
	title: string
	isDone: boolean
}
export type TasksType = {
	[key: string]: TaskType[]
}

function App() {
	const dispatch = useAppDispatch()
	const status = useAppSelector<RequestStatus>(state => state.app.status)
	const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)

	useEffect(() => {
		dispatch(meTC())
	}, [dispatch])

	if (!isInitialized) {
		return <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
			<CircularProgress />
		</div>
	}
	return (
		<div className="App">
			<AppBar position="static" sx={{ marginBottom: '24px' }}>
				<Container sx={{ '.MuiToolbar-root': { padding: '0px' } }}>
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Todos
						</Typography>
						<Button color="inherit">Login</Button>
					</Toolbar>
				</Container>
				{status === 'loading' && <LinearProgress color="secondary" />}
			</AppBar>
			<Container>
				<Outlet />
				<CustomizedSnackbars />
			</Container>
		</div >
	)
}

export default App
