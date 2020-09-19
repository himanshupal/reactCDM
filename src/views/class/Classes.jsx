import { Accordion, Divider, Dimmer, Form } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"

import QUERY_CLASSES from "../../queries/query/classes"
import QUERY_SUBJECTS from "../../queries/query/subjects"
import QUERY_COURSES from "../../queries/query/coursesOnly"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import { AuthContext } from "../../common/context"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

import Subjects from "./Subjects"
import ClassTable from "./ClassTable"

const Classes = ({ history, location, theme }) => {
	const { state } = location

	const {
		user: { department, access },
	} = useContext(AuthContext)

	const [dpt, setDpt] = useState()
	const [courses, setCourses] = useState()
	const [classes, setClasses] = useState()

	const initial = state
		? { query: QUERY_CLASSES, variables: { course: state._id } }
		: { query: QUERY_COURSES, variables: { department } }

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

	document.title = `Classes`

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<>
			<h1>{subjectList ? `Classes & Subjects` : `Classes`}</h1>
			<Dimmer active={loadingClasses || loadingSubjects} inverted={!theme} />
			<Divider horizontal inverted={theme} content={subjectList ? `Classes` : null} />
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
										onChange: (_, { value }) => {
											setDpt(value)
											getCourses({ variables: { department: value } })
										},
									},
								},
							]}
						/>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Select
						fluid
						required
						label="Select Course"
						loading={loadingCourses}
						placeholder="Select a course to get list of classes"
						onClick={() => !list && getCourses({ variables: { department } })}
						options={
							courses
								? courses.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={(_, { value }) => getClasses({ variables: { course: value } })}
					/>
				</Form.Group>
			</Form>

			{classes ? (
				classes.length === 0 ? (
					<h3 className="highlight">There are no classes in this course yet</h3>
				) : (
					<>
						<ClassTable
							theme={theme}
							classes={classes}
							history={history}
							location={location}
							getSubjects={getSubjects}
							department={dpt ? dpt : department}
						/>
						{subjectList ? (
							subjectList.subjects.length === 0 ? (
								<h3 className="highlight">There are no subjects in this class yet</h3>
							) : (
								<>
									<Divider horizontal content="Subjects" inverted={theme} />
									<Subjects
										theme={theme}
										location={location}
										subjects={subjectList.subjects}
										department={dpt ? dpt : department}
									/>
								</>
							)
						) : (
							<h3 className="highlight">
								Click on a class name to get subjects list for that class
							</h3>
						)}
					</>
				)
			) : (
				<h3 className="highlight">Select a course to get list of classes</h3>
			)}
		</>
	)
}

export default Classes
