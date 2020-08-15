import QUERY_COURSES from "../../queries/query/courses"
import QUERY_CLASSES from "../../queries/query/classes"
import QUERY_SUBJECTS from "../../queries/query/subjects"
import MUTATION_TIMETABLE from "../../queries/mutation/createTimeTable"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import { Segment, Table, Form, Label, Divider } from "semantic-ui-react"
import Notify from "../../common/Notify"
import React, { useState } from "react"
import constants from "../common"

const ChangeTimeTable = () => {
	const { loading: crsFetch, error: fetchErr, data } = useQuery(QUERY_COURSES)
	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)
	const [getSubjects, { loading: loadingSubjects, data: subjectsList }] = useLazyQuery(QUERY_SUBJECTS)
	const [timeArray, changeTimeArray] = useState(new Array(1).fill())
	const [notification, setNotification] = useState([])
	const [courseArray, setCourseArray] = useState([])
	const [variables, setVariables] = useState({})

	const [changeTimeTable, { loading }] = useMutation(MUTATION_TIMETABLE, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.createTimeTable }])
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }])
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }])
		},
		variables,
	})

	if (crsFetch) return <h2>Loading...</h2>
	if (fetchErr) return <h2>{fetchErr.toString().split(`: `)[2]}</h2>

	const onChange = (_, { name, value }) => {
		if (notification.length > 0) setNotification([])
		setVariables({ ...variables, [name]: value })
	}
	const getTeacher = (value) => {
		const list = subjectsList.subjects.filter((_) => _._id === value)
		return list.length > 0 ? list[0].teacher._id : null
	}
	const getTeacherName = (value) => {
		const list = subjectsList.subjects.filter((_) => _._id === value)
		return list.length > 0 ? list[0].teacher.name.first + ` ` + list[0].teacher.name.last : `NONE`
	}

	return (
		<Segment className={loading || loadingSubjects ? `loading` : ``}>
			<h1>Create Time Table</h1>
			<Divider />
			<Form
				onSubmit={(e) => {
					e.preventDefault()
					changeTimeTable()
				}}
			>
				<Form.Group widths="equal">
					<Form.Select
						fluid
						name="department"
						label="Department"
						placeholder="Select a Department to get Course list of"
						options={data.departments.departments.map((x) => {
							return { text: x.name, value: x._id }
						})}
						onChange={(_, { value }) => setCourseArray(data.departments.departments.filter((x) => x._id === value)[0].courses)}
					/>
					<Form.Select
						fluid
						name="course"
						label="Course"
						placeholder="Select a Course to get Class list of"
						options={courseArray.map((x) => {
							return { text: x.name, value: x._id }
						})}
						onChange={(_, { value }) => {
							getClasses({
								variables: { course: value },
							})
						}}
					/>
					<Form.Select
						fluid
						name="class_id"
						label="Class"
						loading={loadingClasses}
						placeholder="Select a Class to add Subjects to"
						options={
							classList
								? classList.classes.map((x) => {
										return { key: x._id, text: x.name, value: x.name }
								  })
								: []
						}
						onChange={(_, { value }) => {
							setVariables({ ...variables, className: value })
							getSubjects({
								variables: {
									className: value,
								},
							})
						}}
					/>
				</Form.Group>
				{subjectsList && (
					<>
						<div style={{ overflowX: `scroll`, overflowY: `hidden`, margin: `1em 0`, paddingBottom: `0.5rem` }}>
							<Table definition celled columns={7}>
								<Table.Header>
									<Table.Row textAlign="center">
										<Table.HeaderCell />
										{constants.days
											.filter((_) => _ !== `Sunday`)
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
												.filter((_) => _ !== `Sunday`)
												.map((_, idx) => (
													<Table.Cell
														key={idx}
														content={
															<>
																<Form.Select
																	search
																	label="Subject"
																	name={`day` + odx + idx}
																	options={[...subjectsList.subjects, { _id: `Recess`, name: `Recess` }].map((_) => {
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
																		<Label>{getTeacherName(variables[`subjectId` + odx + idx])}</Label>
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
										setNotification([...notification, { error: `You need to specify atleast one time period to add Time Table.` }])
									else changeTimeArray((timeArray) => new Array(timeArray.length + 1).fill())
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
										setNotification([])
										setVariables((variables) => {
											const len = timeArray.length
											delete variables[`from` + (len - 1)]
											delete variables[`to` + (len - 1)]
											for (let i = 0; i < 6; i++) {
												delete variables[`subjectId` + (len - 1) + i]
												delete variables[`teacherId` + (len - 1) + i]
											}
											return variables
										})
										changeTimeArray((timeArray) => new Array(timeArray.length - 1).fill())
									}}
								/>
							)}
						</Form.Group>
					</>
				)}
			</Form>
			{notification.length > 0 && <Notify list={notification} />}
		</Segment>
	)
}

export default ChangeTimeTable
