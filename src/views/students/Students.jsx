import { Form, Divider, Table, Button, Dimmer, Accordion } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"
import { Link } from "react-router-dom"

import QUERY_STUDENTS from "../../queries/query/students"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

const StudentsTable = ({ students }) => (
	<Table sortable celled striped color="red">
		<Table.Header>
			<Table.Row>
				<Table.HeaderCell content="S. No." />
				<Table.HeaderCell content="Roll No." />
				<Table.HeaderCell content="Username" />
				<Table.HeaderCell content="First Name" />
				<Table.HeaderCell content="Last Name" />
				<Table.HeaderCell content="Contact" />
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{students.map((student, idx) => (
				<Table.Row key={idx} children="button">
					<Table.Cell>{idx + 1}</Table.Cell>
					<Table.Cell>{student.rollNumber ? student.rollNumber : `- - -`}</Table.Cell>
					<Table.Cell>
						<Link to={`/students/${student.username}`}>{student.username}</Link>
					</Table.Cell>
					<Table.Cell>{student.name.first}</Table.Cell>
					<Table.Cell>{student.name.last ? student.name.last : `- - -`}</Table.Cell>
					<Table.Cell>
						{student.contactNumber && (
							<a href={`tel:${student.contactNumber}`}>{student.contactNumber}</a>
						)}
						{student.email && (
							<>
								<br />
								<a href={`mailto:${student.email}`}>{student.email}</a>
							</>
						)}
						{!student.contactNumber && !student.email && `- - -`}
					</Table.Cell>
				</Table.Row>
			))}
		</Table.Body>
		<Table.Footer fullWidth>
			<Table.Row>
				<Table.HeaderCell colSpan="6" textAlign="right">
					<Button as={Link} to="/addstudent">
						Add Student
					</Button>
				</Table.HeaderCell>
			</Table.Row>
		</Table.Footer>
	</Table>
)

const Students = ({ location: { state }, theme }) => {
	const {
		user: { access, department, classTeacherOf },
	} = useContext(AuthContext)

	const initial = state
		? { query: QUERY_CLASSES, variables: { course: state._id } }
		: !!classTeacherOf
		? { query: QUERY_STUDENTS, variables: { class: classTeacherOf } }
		: { query: QUERY_COURSES, variables: { department } }

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)

	const [getStudents, { loading: loadingStudents, data: studentsList }] = useLazyQuery(
		QUERY_STUDENTS
	)

	const [courses, setCourses] = useState()
	const [classes, setClasses] = useState()
	const [students, setStudents] = useState()

	useEffect(() => (state ? setClasses(data && data.classes) : setCourses(data && data.courses)), [
		data,
		state,
	])

	useEffect(() => courseList && setCourses(courseList.courses), [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	useEffect(() => {
		if (sessionStorage.Students) {
			if (studentsList) {
				setStudents(JSON.parse(sessionStorage.Students))
				sessionStorage.setItem(`Students`, JSON.stringify(studentsList.students))
			}
			setStudents(JSON.parse(sessionStorage.Students))
		} else {
			if (studentsList) {
				setStudents(studentsList.students)
				sessionStorage.setItem(`Students`, JSON.stringify(studentsList.students))
			}
		}
	}, [studentsList])

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<>
			<h1>Students</h1>
			<Dimmer active={loadingStudents} inverted={!theme} />
			<Divider />
			<Form widths="equal" inverted={theme}>
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
						label="Course"
						loading={loadingCourses}
						onClick={() => !list && getCourses({ variables: { department } })}
						placeholder="Select a course to get list of classes"
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
						required
						label="Class"
						loading={loadingClasses}
						placeholder="Select a Class to get Student of"
						options={
							classes
								? classes.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={(_, { value }) => getStudents({ variables: { class: value } })}
					/>
				</Form.Group>
			</Form>
			{students ? (
				students.length === 0 ? (
					<h3 className="highlight">There are no students in this class yet</h3>
				) : (
					<StudentsTable students={students} />
				)
			) : (
				<h3 className="highlight">Please select a class first to get list of students</h3>
			)}
		</>
	)
}

export default Students
