import { Accordion, Table, Form, Label, Divider, Dimmer } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"
import { toast } from "react-toastify"

import QUERY_CLASSES from "../../queries/query/classes"
import QUERY_COURSES from "../../queries/query/courses"
import QUERY_SUBJECTS from "../../queries/query/subjects"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import MUTATION_TIMETABLE from "../../queries/mutation/createTimeTable"

import constants from "../../common/constants"

import MutationError from "../shared/MutationError"
import Loading from "../shared/Loading"
import Error from "../shared/Error"
import { getName } from "../shared/helpers"

const ChangeTimeTable = ({ history, location: { state }, theme }) => {
	const {
		user: { department, access },
	} = useContext(AuthContext)

	const initial = state
		? { query: QUERY_CLASSES, variables: { course: state._id } }
		: { query: QUERY_COURSES, variables: { department } }

	const [courses, setCourses] = useState()
	const [classes, setClasses] = useState()
	const [variables, setVariables] = useState({})

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)

	const [getSubjects, { loading: loadingSubjects, data: subjectList }] = useLazyQuery(
		QUERY_SUBJECTS
	)

	useEffect(() => (state ? setClasses(data && data.classes) : setCourses(data && data.courses)), [
		data,
		state,
	])

	useEffect(() => courseList && setCourses(courseList.courses), [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	const [timeArray, changeTimeArray] = useState(new Array(1).fill())

	const [changeTimeTable, { loading: saving }] = useMutation(MUTATION_TIMETABLE, {
		update: () => {
			toast.success(<h3>Time Table Changed</h3>)
			history.push(`/timetable`)
		},
		onError: e => MutationError(e),
		variables,
	})

	if (loading) return <Loading />
	if (error) return <Error />

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const getTeacher = value => {
		const list = subjectList.subjects.filter(_ => _._id === value)
		return list.length > 0 && list[0].teacher ? list[0].teacher._id : null
	}

	const getTeacherName = value => {
		const list = subjectList.subjects.filter(_ => _._id === value)
		return list.length > 0 && list[0].teacher ? getName(list[0].teacher.name) : `NONE`
	}

	return (
		<>
			<h1>Create Time Table</h1>
			<Dimmer active={saving || loadingSubjects} inverted={!theme} />
			<Divider />
			<Form
				widths="equal"
				inverted={theme}
				onSubmit={e => {
					e.preventDefault()
					changeTimeTable()
				}}
			>
				<Form.Group>
					{access === `Director` && (
						<Accordion
							as={Form.Field}
							inverted={theme}
							onClick={getDepartments}
							panels={[
								{
									key: `department`,
									title: `Change Department`,
									content: {
										loading: loadingDepartments,
										placeholder: `Select department to get list of courses`,
										as: Form.Select,
										options: list
											? list.departments.map(x => {
													return { text: x.name, value: x._id }
											  })
											: [],
										onChange: (_, { value }) => getCourses({ variables: { department: value } }),
									},
								},
							]}
						/>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Select
						fluid
						label="Course"
						loading={loadingCourses}
						placeholder="Select a Course to get Class list of"
						options={
							courses
								? courses.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={(_, { value }) => getClasses({ variables: { course: value } })}
					/>
					<Form.Select
						fluid
						name="class"
						label="Class"
						loading={loadingClasses}
						placeholder="Select a Class to add Subjects to"
						options={
							classes
								? classes.map(x => {
										return { text: x.name, value: x.name }
								  })
								: []
						}
						onChange={(_, { value }) => {
							setVariables({ ...variables, class: value })
							getSubjects({ variables: { class: value } })
						}}
					/>
				</Form.Group>
				{subjectList && (
					<>
						<div className="table_overflow">
							<Table definition celled columns={7} unstackable inverted={theme}>
								<Table.Header>
									<Table.Row textAlign="center">
										<Table.HeaderCell />
										{constants.days
											.filter(_ => _ !== `Sunday`)
											.map((day, idx) => (
												<Table.HeaderCell content={day} key={idx} />
											))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{timeArray.map((_, odx) => (
										<Table.Row key={odx}>
											<Table.Cell
												content={
													<div style={{ display: `flex`, flexDirection: `column` }}>
														<Form.Input
															label="From"
															required
															name={`from` + odx}
															type="time"
															min={variables[`to` + (Number(odx) - 1)] || `08:00`}
															max="17:30"
															onChange={onChange}
														/>
														<Form.Input
															label="To"
															required
															name={`to` + odx}
															type="time"
															min={variables[`from` + odx] || `08:30`}
															max="18:00"
															onChange={onChange}
														/>
													</div>
												}
											/>
											{constants.days
												.filter(_ => _ !== `Sunday`)
												.map((_, idx) => (
													<Table.Cell
														key={idx}
														content={
															<>
																<Form.Select
																	search
																	label="Subject"
																	name={`day` + odx + idx}
																	options={[
																		...subjectList.subjects,
																		{ _id: `Recess`, name: `Recess` },
																	].map(_ => {
																		return { key: _._id, value: _._id, text: _.name }
																	})}
																	onChange={(_, { name, value }) =>
																		setVariables({
																			...variables,
																			[`subjectId` + odx + idx]: value,
																			[`teacherId` + odx + idx]: getTeacher(value),
																		})
																	}
																/>
																{variables[`subjectId` + odx + idx] && (
																	<>
																		<Form.Field label="Teacher" />
																		<Label>
																			{getTeacherName(variables[`subjectId` + odx + idx])}
																		</Label>
																	</>
																)}
															</>
														}
													/>
												))}
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						</div>
						<Form.Group>
							<Form.Button width={10} fluid color="purple" content="Submit" />
							<Form.Button
								fluid
								type="button"
								color="green"
								content="Add Time Period"
								width={timeArray.length > 1 ? 3 : 6}
								onClick={() => {
									if (timeArray.length >= 9)
										toast.warning(`You need to specify atleast one time period to add Time Table`)
									else changeTimeArray(timeArray => new Array(timeArray.length + 1).fill())
								}}
							/>
							{timeArray.length > 1 && (
								<Form.Button
									fluid
									width={3}
									color="red"
									type="button"
									content="Remove Time Period"
									onClick={() => {
										setVariables(variables => {
											const len = timeArray.length
											delete variables[`from` + (len - 1)]
											delete variables[`to` + (len - 1)]
											for (let i = 0; i < 6; i++) {
												delete variables[`subjectId` + (len - 1) + i]
												delete variables[`teacherId` + (len - 1) + i]
											}
											return variables
										})
										changeTimeArray(timeArray => new Array(timeArray.length - 1).fill())
									}}
								/>
							)}
						</Form.Group>
					</>
				)}
			</Form>
		</>
	)
}

export default ChangeTimeTable
