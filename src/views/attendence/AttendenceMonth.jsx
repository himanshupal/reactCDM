import {
	Table,
	Checkbox,
	Button,
	Grid,
	Dropdown,
	Dimmer,
	Icon,
	Divider,
	Form,
} from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import React, { useState, useEffect, useContext } from "react"
import constants from "../../common/constants"

import ADD_ATTENDENCE_MONTH from "../../queries/mutation/attendenceMonth"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import QUERY_ATTENDENCE from "../../queries/query/attendence"

import { getName, getSundays } from "../shared/helpers"
import Error from "../shared/Error"
import Loading from "../shared/Loading"
import AreYouSure from "../shared/AreYouSure"
import MutationError from "../shared/MutationError"

import { AuthContext } from "../../common/context"

import { toast } from "react-toastify"

const MonthView = ({ location, theme }) => {
	const {
		user: { access },
	} = useContext(AuthContext)

	const yearNow = new Date().getFullYear()
	const monthNow = new Date().getMonth()

	const [currentMonth, setMonth] = useState({
		month: monthNow,
		year: yearNow,
	})

	const [disDates, setDisDates] = useState([])
	const [students, setStudents] = useState([])
	const [confirm, setConfirm] = useState(false)
	const [variables, setVariables] = useState({})
	const [previousAttendence, setPreviousAttendence] = useState([])

	const { loading, error, data } = useQuery(QUERY_ATTENDENCE, {
		variables: { class: location.state },
	})

	const [getDepartments, { loading: gettingDepartments, data: dptList }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)
	const [getCourses, { loading: gettingCourses, data: crsList }] = useLazyQuery(QUERY_COURSES)
	const [getClasses, { loading: gettingClasses, data: clsList }] = useLazyQuery(QUERY_CLASSES)
	const [getAttendence, { loading: change, data: newData }] = useLazyQuery(QUERY_ATTENDENCE, {
		variables: { ...currentMonth, class: variables.class || location.state },
	})

	const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()

	const [sundays, setSundays] = useState(getSundays(currentMonth.month, currentMonth.year))
	const [numberOfDays, setNumberOfDays] = useState(
		new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill()
	)

	const [addAttendenceMonth, { loading: saving }] = useMutation(ADD_ATTENDENCE_MONTH, {
		update: () => {
			setConfirm(false)
			toast.success(<h3>Attendence Saved</h3>)
			window.location.reload()
		},
		onError: e => MutationError(e),
		variables: location.state ? { ...variables, class: location.state } : variables,
	})

	const prevMonth = () => {
		currentMonth.month > 0
			? setMonth({ ...currentMonth, month: currentMonth.month - 1 })
			: setMonth({ month: 11, year: currentMonth.year - 1 })
		getAttendence()
	}
	const nextMonth = () => {
		currentMonth.month < 11
			? setMonth({ ...currentMonth, month: currentMonth.month + 1 })
			: setMonth({ month: 0, year: currentMonth.year + 1 })
		getAttendence()
	}

	useEffect(() => {
		setDisDates([])
		setPreviousAttendence(
			new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill(false).map((x, idx) =>
				newData
					? newData.attendence.map(y => Number(y.day.split(/\//)[0])).includes(idx + 1)
						? newData.attendence
								.filter(y => Number(y.day.split(/\//)[0]) === idx + 1)
								.map(y => {
									return { students: y.students.map(x => x._id) || [], holiday: y.holiday }
								})[0]
						: x
					: data && data.attendence.map(y => Number(y.day.split(/\//)[0])).includes(idx + 1)
					? data.attendence
							.filter(y => Number(y.day.split(/\//)[0]) === idx + 1)
							.map(y => {
								return { students: y.students.map(x => x._id) || [], holiday: y.holiday }
							})[0]
					: x
			)
		)
		newData ? setStudents(newData.students) : setStudents(data && data.students)
	}, [data, newData, currentMonth])

	useEffect(() => {
		setSundays(getSundays(currentMonth.month, currentMonth.year))
		setNumberOfDays(new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill())
	}, [currentMonth])

	useEffect(() => {
		setDisDates(disDates => [
			...disDates,
			...previousAttendence.map((x, idx) => x && x.holiday && idx).filter(x => x),
		])
	}, [previousAttendence])

	const onDateDoubleClick = date => {
		setConfirm(false)
		if (sundays.includes(date)) return
		setVariables(variables => {
			students &&
				students.forEach(() => {
					variables = {
						...variables,
						[`students` + date]: students.map(x => x._id),
						[`day` + date]: `${date + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
					}
				})
			return variables
		})
	}

	const onDateClick = date => {
		setConfirm(false)
		if (sundays.includes(date)) return
		variables[`holiday` + date]
			? setVariables(variables => {
					delete variables[`holiday` + date]
					delete variables[`day` + date]
					return variables
			  })
			: !disDates.includes(date) &&
			  setVariables(variables => {
					delete variables[`students` + date]
					return {
						...variables,
						[`holiday` + date]: `Not Specified !`,
						[`day` + date]: `${date + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
					}
			  })
		disDates.includes(date)
			? setDisDates(disDates.filter(x => x !== date))
			: setDisDates([...disDates, date])
	}

	const onNameDoubleClick = student => {
		setConfirm(false)
		setVariables(variables => {
			numberOfDays.forEach((_, idx) => {
				variables = {
					...variables,
					[`students` + idx]:
						sundays.includes(idx) || disDates.includes(idx)
							? undefined
							: variables[`students` + idx]
							? variables[`students` + idx].includes(student._id)
								? variables[`students` + idx]
								: [...variables[`students` + idx], student._id]
							: [...(variables[`students` + idx] || []), student._id],
					[`day` + idx]:
						sundays.includes(idx) || disDates.includes(idx)
							? undefined
							: `${idx + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
				}
			})
			return variables
		})
	}

	const onCheckBoxClick = (student, idx) => {
		setConfirm(false)
		variables[`students` + idx]
			? variables[`students` + idx].includes(student._id)
				? setVariables(variables => {
						if (!previousAttendence[idx] && variables[`students` + idx].length === 1) {
							delete variables[`students` + idx]
							delete variables[`day` + idx]
							return { ...variables }
						} else
							return {
								...variables,
								[`students` + idx]: [...variables[`students` + idx].filter(x => x !== student._id)],
							}
				  })
				: setVariables({
						...variables,
						[`students` + idx]: [...variables[`students` + idx], student._id],
				  })
			: previousAttendence[idx]
			? previousAttendence[idx].students.includes(student._id)
				? setVariables(variables => {
						return {
							...variables,
							[`day` + idx]: `${idx + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
							[`students` + idx]: previousAttendence[idx].students.filter(x => x !== student._id),
						}
				  })
				: setVariables(variables => {
						return {
							...variables,
							[`day` + idx]: `${idx + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
							[`students` + idx]: [...previousAttendence[idx].students, student._id],
						}
				  })
			: setVariables({
					...variables,
					[`day` + idx]: `${idx + 1}/${Number(currentMonth.month) + 1}/${currentMonth.year}`,
					[`students` + idx]: [student._id],
			  })
	}

	if (loading) return <Loading />
	if (error) return <Error />

	document.title = `Attendence | ${
		constants.months[currentMonth.month]
	} ${currentMonth.year.toString()}`

	return (
		<>
			<h1>Update Attendence</h1>
			<Dimmer active={change || saving} inverted={!theme} />
			<Divider />
			{(access === `Director` || access === `Head of Department`) && (
				<Form widths="equal" inverted={theme}>
					<Form.Group>
						{access === `Director` && (
							<Form.Select
								onClick={getDepartments}
								label="Change Department"
								options={
									dptList
										? dptList.departments.map(x => {
												return { text: x.name, value: x._id }
										  })
										: []
								}
								loading={gettingDepartments}
								onChange={(_, { value }) => getCourses({ variables: { department: value } })}
							/>
						)}
						<Form.Select
							onClick={() => !dptList && getCourses()}
							label="Change Course"
							options={
								crsList
									? crsList.courses.map(x => {
											return { text: x.name, value: x._id }
									  })
									: []
							}
							loading={gettingCourses}
							onChange={(_, { value }) => getClasses({ variables: { course: value } })}
						/>
						<Form.Select
							label="Change Class"
							options={
								clsList
									? clsList.classes.map(x => {
											return { text: x.name, value: x._id }
									  })
									: []
							}
							loading={gettingClasses}
							onChange={(_, { value }) => {
								setVariables({ ...variables, class: value })
								getAttendence({ variables: { class: value } })
							}}
						/>
					</Form.Group>
				</Form>
			)}
			{students && students.length > 0 ? (
				<>
					<Grid style={{ paddingBottom: `1rem` }}>
						<Grid.Row columns={3}>
							<Grid.Column verticalAlign="middle" textAlign="left">
								<Button
									inverted={theme}
									onClick={prevMonth}
									content={<Icon inverted={theme} name="left arrow" />}
								/>
							</Grid.Column>
							<Grid.Column textAlign="center" verticalAlign="middle" stretched>
								<h3>
									<Dropdown
										inline
										search
										scrolling
										text={constants.months[currentMonth.month]}
										options={
											currentMonth.year === yearNow
												? constants.months
														.map((x, idx) => {
															if (idx <= monthNow) return { text: x, value: idx }
															else return null
														})
														.filter(x => x)
												: constants.months.map((x, idx) => {
														return { text: x, value: idx }
												  })
										}
										onChange={(_, { value }) => {
											setMonth({ ...currentMonth, month: value })
											getAttendence()
										}}
									/>
									<Dropdown
										inline
										search
										scrolling
										text={currentMonth.year.toString()}
										options={
											currentMonth.month > monthNow
												? new Array(yearNow - 1996).fill(yearNow).map((x, idx) => {
														const r = x - idx - 1
														return { text: r.toString(), value: r }
												  })
												: new Array(yearNow - 1995).fill(yearNow).map((x, idx) => {
														const r = x - idx
														return { text: r.toString(), value: r }
												  })
										}
										onChange={(_, { value }) => {
											setMonth({ ...currentMonth, year: value })
											getAttendence()
										}}
									/>
								</h3>
							</Grid.Column>
							<Grid.Column textAlign="right" verticalAlign="middle">
								<Button
									inverted={theme}
									onClick={nextMonth}
									disabled={currentMonth.month >= monthNow && currentMonth.year >= yearNow}
									content={<Icon inverted={theme} name="right arrow" />}
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>

					<div className="table_overflow">
						<Table
							striped
							celled
							sortable
							singleLine
							selectable
							unstackable
							size="small"
							inverted={theme}
						>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell verticalAlign="middle" content="Date →" />
									{numberOfDays.map((_, date) => (
										<Table.HeaderCell
											key={date}
											content={date + 1}
											textAlign="center"
											verticalAlign="middle"
											onClick={() => onDateClick(date)}
											onDoubleClick={() => onDateDoubleClick(date)}
										/>
									))}
									<Table.HeaderCell content="Total" />
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{students.map((student, idx) => (
									<Table.Row key={idx}>
										<Table.Cell
											verticalAlign="middle"
											style={{ cursor: `pointer` }}
											content={<em>{getName(student.name)}</em>}
											onDoubleClick={() => onNameDoubleClick(student)}
										/>
										{numberOfDays.map((_, idx) => (
											<Table.Cell verticalAlign="middle" textAlign="center" key={idx} selectable>
												{sundays.includes(idx) ? (
													<em>S</em>
												) : disDates.includes(idx) ? (
													<em>H</em>
												) : (
													<Checkbox
														checked={
															variables[`students` + idx]
																? variables[`students` + idx].includes(student._id)
																: previousAttendence[idx] &&
																  previousAttendence[idx].students.includes(student._id)
														}
														onClick={() => onCheckBoxClick(student, idx)}
													/>
												)}
											</Table.Cell>
										))}
										<Table.Cell
											textAlign="center"
											content={
												numberOfDays
													.map((_, idx) => {
														if (variables[`students` + idx])
															if (variables[`students` + idx].includes(student._id)) return idx
															else return null
														if (previousAttendence[idx])
															if (previousAttendence[idx].students.includes(student._id)) return idx
														return null
													})
													.filter(x => x).length
											}
										/>
									</Table.Row>
								))}
								<Table.Row>
									<Table.Cell textAlign="right">
										<b>Total:</b>
									</Table.Cell>
									{numberOfDays.map((_, idx) => (
										<Table.Cell key={idx} textAlign="center">
											{sundays.includes(idx) ? (
												<b>#</b>
											) : variables[`holiday` + idx] ? (
												0
											) : variables[`students` + idx] ? (
												variables[`students` + idx].length
											) : previousAttendence[idx] ? (
												previousAttendence[idx].students.length
											) : (
												0
											)}
										</Table.Cell>
									))}
									<Table.Cell textAlign="center" content="X" />
								</Table.Row>
							</Table.Body>
						</Table>
					</div>

					<Button
						fluid
						animated="fade"
						inverted={theme}
						disabled={Object.keys(variables).length <= 1}
						content={
							<>
								<Button.Content visible content={<Icon name="save" />} />
								<Button.Content hidden content="Save" />
							</>
						}
						onClick={() => setConfirm(true)}
					/>
				</>
			) : (
				<h3 className="highlight">Class doesn't have any students yet</h3>
			)}
			<AreYouSure
				open={confirm}
				onConfirm={addAttendenceMonth}
				onCancel={() => setConfirm(false)}
				theme={theme}
			/>
		</>
	)
}

export default MonthView
