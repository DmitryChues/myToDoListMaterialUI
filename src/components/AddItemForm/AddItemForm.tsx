import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react'
// import { Button } from '../Button/Button';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { RequestStatus } from '../../app/appReducer'

type AddItemFormType = {
	addItem: (title: string) => void
	entityStatus?: RequestStatus
}

export const AddItemForm: FC<AddItemFormType> = memo(({ addItem, entityStatus }) => {
	const [error, setError] = useState<string | null>(null)
	const [taskTitle, setTaskTitle] = useState<string>('')
	const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTaskTitle(e.currentTarget.value)
	}
	const onClickButtonHandler = () => {
		if (taskTitle.trim() === '') {
			setError('Give the name')
			return
		}
		addItem(taskTitle.trim())
		setTaskTitle('')
	}
	const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		e.key && setError(null)
		e.key === "Enter" && onClickButtonHandler()
	}
	const styles = {
		minWidth: '40px',
		maxWidth: '40px',
		height: '40px',
		borderRadius: '0 4px 4px 0',
	}
	return (
		<div style={{ display: 'flex' }}>
			<TextField
				disabled={entityStatus === 'loading'}
				sx={{ '.MuiOutlinedInput-root': { borderRadius: '4px 0 0 4px' }, flex: '1 1 auto' }}
				error={!!error}
				label={error ? "Title is required" : "Type smth..."}
				value={taskTitle}
				size='small'
				onChange={onChangeInputHandler}
				onKeyDown={onKeyDownHandler}
			/>
			<Button disabled={entityStatus === 'loading'} sx={styles} variant='contained' onClick={onClickButtonHandler}>
				<AddIcon />
			</Button>
		</div>
	)
})