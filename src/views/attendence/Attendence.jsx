import React, { useState, useEffect } from "react"
import { Table, Button, Input, Divider, Icon, Dimmer } from "semantic-ui-react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import QUERY_STUDENTS from "../../queries/query/studentsForAttendence"
import ADD_ATTENDENCE from "../../queries/mutation/addAttendence"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

import MutationError from "../shared/MutationError"
import { getName } from "../shared/helpers"

const Attendence = ({ location, theme }) => {
	const { loading, error, data } = useQuery(QUERY_STUDENTS, {
		variables: { class: location.state },
	})
	const [direction, setDirection] = useState(`ascending`)
	const [variables, setVariables] = useState({})
	const [holiday, setHoliday] = useState(false)
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

	document.title = `Attendence | ${new Date().toDateString()}`

	if (loading) return <Loading />
	if (error) return <Error />

	const sortColumn = field => {
		if (column === field) {
			data.students.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					data.students.sort((p, n) => {
						if (p.rollNumber && n.rollNumber) return p.rollNumber < n.rollNumber ? -1 : 1
						else return null
					})
					break
				case 2:
					data.students.sort((p, n) =>
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
			<Dimmer active={saving} inverted={!theme} />
			<Divider />
			{new Date().getDay() === 0 ? (
				<h3 className="highlight">Today is Sunday</h3>
			) : data.students.length > 0 ? (
				<>
					<Table color="violet" inverted={theme} unstackable>
						<Table.Body>
							<Table.Row textAlign="center">
								<Table.Cell>Total Students: {data.students.length}</Table.Cell>
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
								{data.students.map((student, idx) => (
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
