import React, { useState, useEffect, useContext } from "react"
import { Table, Button, Input, Divider, Icon, Dimmer, Form } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import QUERY_STUDENTS from "../../queries/query/studentsForAttendence"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import ADD_ATTENDENCE from "../../queries/mutation/addAttendence"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

import MutationError from "../shared/MutationError"
import { getName } from "../shared/helpers"
import { AuthContext } from "../../common/context"

const Attendence = ({ location, theme }) => {
	const {
		user: { access },
	} = useContext(AuthContext)

	const { loading, error, data } = useQuery(QUERY_STUDENTS, {
		variables: { class: location.state },
	})

	const [getDepartments, { loading: gettingDepartments, data: dptList }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)
	const [getCourses, { loading: gettingCourses, data: crsList }] = useLazyQuery(QUERY_COURSES)
	const [getClasses, { loading: gettingClasses, data: clsList }] = useLazyQuery(QUERY_CLASSES)
	const [getStudents, { loading: gettingStudents, data: newData }] = useLazyQuery(QUERY_STUDENTS)

	const [direction, setDirection] = useState(`ascending`)
	const [variables, setVariables] = useState({})
	const [holiday, setHoliday] = useState(false)
	const [students, setStudents] = useState([])
	const [present, setPresent] = useState([])
	const [column, setColumn] = useState(1)

	const [addAttendence, { loading: saving }] = useMutation(ADD_ATTENDENCE, {
		update: (_, { data: { addAttendence } }) => toast.success(<h3>{addAttendence}</h3>),
		onError: e => MutationError(e),
		variables: location.state ? { ...variables, class: location.state } : variables,
	})

	useEffect(() => {
		setVariables(variables => {
			return { ...variables, students: present }
		})
	}, [present])

	useEffect(() => (newData ? setStudents(newData.students) : setStudents(data && data.students)), [
		newData,
		data,
	])

	if (loading) return <Loading />
	if (error) return <Error />

	document.title = `Attendence | ${new Date().toDateString()}`

	const sortColumn = field => {
		if (column === field) {
			students.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					students.sort((p, n) => {
						if (p.rollNumber && n.rollNumber) return p.rollNumber < n.rollNumber ? -1 : 1
						else return null
					})
					break
				case 2:
					students.sort((p, n) =>
						p.name.first.toLowerCase() < n.name.first.toLowerCase() ? -1 : 1
					)
					break
				default:
					return
			}
		}
	}

	return (
		<>
			<h1>Attendence</h1>
			<Dimmer active={saving || gettingStudents} inverted={!theme} />
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
								getStudents({ variables: { class: value } })
							}}
						/>
					</Form.Group>
				</Form>
			)}
			{students && students.length > 0 ? (
				<>
					<Table color="violet" inverted={theme} unstackable>
						<Table.Body>
							<Table.Row textAlign="center">
								<Table.Cell>Total Students: {students.length}</Table.Cell>
								<Table.Cell>Present Students: {present.length}</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
					<div className="table_overflow">
						<Table unstackable sortable compact celled striped inverted={theme}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell textAlign="center" content="S.No." />
									<Table.HeaderCell
										sorted={column === 1 ? direction : null}
										onClick={() => sortColumn(1)}
										content="Roll No."
									/>
									<Table.HeaderCell
										sorted={column === 2 ? direction : null}
										onClick={() => sortColumn(2)}
										content="Name"
									/>
									<Table.HeaderCell content="Present" />
									<Table.HeaderCell content="Date of Birth" />
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{students.map((student, idx) => (
									<Table.Row key={idx}>
										<Table.Cell textAlign="center" content={idx + 1} />
										<Table.Cell content={student.rollNumber} />
										<Table.Cell
											selectable
											content={
												<Link to={`/student/` + student.username}>{getName(student.name)}</Link>
											}
										/>
										<Table.Cell>
											<Button
												fluid
												type="button"
												disabled={holiday}
												color={present.includes(student._id) ? `green` : `youtube`}
												onClick={() =>
													present.includes(student._id)
														? setPresent(present.filter(x => x !== student._id))
														: setPresent(present => [...present, student._id])
												}
												content={present.includes(student._id) ? `Yes` : `No`}
											/>
										</Table.Cell>
										<Table.Cell content={student.name.dateOfBirth} />
									</Table.Row>
								))}
							</Table.Body>
							<Table.Footer>
								<Table.Row>
									<Table.HeaderCell colSpan="2">
										<Button
											fluid
											type="button"
											color="facebook"
											content="Holiday"
											onClick={() => {
												setHoliday(holiday => {
													holiday
														? delete variables.holiday
														: setVariables(variables => {
																delete variables.students
																return variables
														  })
													return !holiday
												})
											}}
										/>
									</Table.HeaderCell>
									{holiday && (
										<Table.HeaderCell colSpan="2">
											<Input
												fluid
												label="Reason:"
												onChange={(_, { value }) => setVariables({ ...variables, holiday: value })}
											/>
										</Table.HeaderCell>
									)}
									<Table.HeaderCell colSpan={holiday ? 1 : 3} textAlign="right">
										<Button
											fluid
											type="button"
											animated="fade"
											inverted={theme}
											disabled={!variables.holiday && present.length === 0}
											content={
												<>
													<Button.Content visible content={<Icon name="save" />} />
													<Button.Content hidden content="Save" />
												</>
											}
											onClick={addAttendence}
										/>
									</Table.HeaderCell>
								</Table.Row>
							</Table.Footer>
						</Table>
					</div>
				</>
			) : (
				<h3 className="highlight">Class doesn't have any students yet</h3>
			)}
		</>
	)
}

export default Attendence
