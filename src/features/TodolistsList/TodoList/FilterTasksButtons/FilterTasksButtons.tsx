import React, { FC, memo, useCallback } from 'react'
import { FilterValuesType } from '../../../../app/App'
import ButtonGroup from '@mui/material/ButtonGroup'
import { ButtonMui } from '../../../../components/ButtonMui/ButtonMui'


type FilterTasksButtonsPropsType = {
	filter: FilterValuesType
	changeTodoListFilter: (filter: FilterValuesType) => void
}

export const FilterTasksButtons: FC<FilterTasksButtonsPropsType> = memo(({ changeTodoListFilter, filter }) => {
	const onAllClickHandler = useCallback(() => changeTodoListFilter('all'), [changeTodoListFilter])
	const onActiveClickHandler = useCallback(() => changeTodoListFilter('active'), [changeTodoListFilter])
	const onCompletedClickHandler = useCallback(() => changeTodoListFilter('completed'), [changeTodoListFilter])
	return (
		<ButtonGroup size="medium" aria-label="Small button group">
			<ButtonMui variant={filter === 'all' ? 'contained' : 'outlined'} onClick={onAllClickHandler}>All</ButtonMui>
			<ButtonMui variant={filter === 'active' ? 'contained' : 'outlined'} onClick={onActiveClickHandler}>Active</ButtonMui>
			<ButtonMui variant={filter === 'completed' ? 'contained' : 'outlined'} color={'success'} onClick={onCompletedClickHandler}>Completed</ButtonMui>
		</ButtonGroup>
	)
})