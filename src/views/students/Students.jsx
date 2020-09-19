import { Form, Divider, Button, Dimmer, Accordion } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"

import QUERY_STUDENTS from "../../queries/query/students"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import Loading from "../shared/Loading"
import Error from "../shared/Error"
import SingleStudent from "./SingleStudent"

const Students = ({ history, location: { state }, theme }) => {
	const {
		user: { access, department, classTeacherOf },
	} = useContext(AuthContext)

	const initial = state
		? { query: QUERY_STUDENTS, variables: { class: state._id } }
		: classTeacherOf
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
	const [selected, setSelected] = useState()

	useEffect(
		() =>
			state || classTeacherOf
				? setStudents(data && data.students)
				: setCourses(data && data.courses),
		[data, state, classTeacherOf]
	)

	useEffect(() => courseList && setCourses(courseList.courses), [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	useEffect(() => studentsList && setStudents(studentsList.students), [studentsList])

	document.title = `Students`

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
						onChange={(_, { value }) => {
							setSelected(value)
							getStudents({ variables: { class: value } })
						}}
					/>
				</Form.Group>
			</Form>
			{students ? (
				students.length === 0 ? (
					<h3 className="highlight">There are no students in this class yet</h3>
				) : (
					<SingleStudent students={students} theme={theme} selected={selected} history={history} />
				)
			) : (
				<h3 className="highlight">Please select a class first to get list of students</h3>
			)}
			<Button
				type="button"
				floated="right"
				to="/addstudent"
				onClick={() => history.push(`/addStudent`, { class: selected })}
				content="Add Student"
			/>
		</>
	)
}

export default Students
