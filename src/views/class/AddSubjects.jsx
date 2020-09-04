import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"
import { Form, Divider, Icon, Dimmer, Accordion, Button } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"

import QUERY_CLASSES from "../../queries/query/classesNameOnly"
import QUERY_COURSES from "../../queries/query/courseAndTeacherNames"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import ADD_SUBJECTS from "../../queries/mutation/addSubjects"

import Loading from "../shared/Loading"
import Error from "../shared/Error"
import { getName } from "../shared/helpers"
import AreYouSure from "../shared/AreYouSure"
import { toast } from "react-toastify"

import MutationError from "../shared/MutationError"

const AddSubjects = ({ location: { state }, theme }) => {
	const {
		user: { access, department },
	} = useContext(AuthContext)

	const [classes, setClasses] = useState()
	const [courses, setCourses] = useState([])
	const [subjects, setSubjects] = useState(1)
	const [teachers, setTeachers] = useState([])
	const [confirm, setConfirm] = useState(false)
	const [variables, setVariables] = useState({})

	const initial = state
		? { query: QUERY_CLASSES, variables: { course: state._id } }
		: { query: QUERY_COURSES, variables: { department } }

	const { loading, error, data } = useQuery(initial.query, { variables: initial.variables })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES)

	const [addSubjects, { loading: savingSubjects }] = useMutation(ADD_SUBJECTS, {
		update: () => {
			toast.success(`${subjects} subjects successfully saved`)
			setVariables({})

			// history.push(`/dashboard`)
		},
		onError: e => MutationError(e),
		variables,
	})

	useEffect(() => {
		if (state) setClasses(data && data.classes)
		else if (data) {
			setCourses(data.courses)
			setTeachers(data.teachers)
		}
	}, [data, state])

	useEffect(() => {
		if (courseList) {
			setCourses(courseList.courses)
			setTeachers(courseList.teachers)
		}
	}, [courseList])

	useEffect(() => classList && setClasses(classList.classes), [classList])

	if (loading) return <Loading />
	if (error) return <Error />

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	return (
		<>
			<h1>Add Subjects</h1>
			<Dimmer active={loadingClasses || savingSubjects} inverted={!theme} />
			<Divider content="Class Details" horizontal inverted={theme} />
			<Form
				widths="equal"
				inverted={theme}
				onSubmit={e => {
					e.preventDefault()
					setConfirm(true)
				}}
			>
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

				<Form.Group>
					<Form.Select
						fluid
						label="Select Course"
						loading={loadingCourses}
						placeholder="Select a course to get list of classes"
						onClick={() => !list && getCourses({ variables: { department } })}
						options={courses.map(x => {
							return { text: x.name, value: x._id }
						})}
						onChange={(_, { value }) => getClasses({ variables: { course: value } })}
					/>
					<Form.Select
						required
						name="class"
						label="Select Class"
						loading={loadingClasses}
						placeholder="Select a class to add subjects to"
						options={
							classes
								? classes.map(x => {
										return { text: x.name, value: x.name }
								  })
								: []
						}
						onChange={onChange}
					/>
				</Form.Group>

				{[...new Array(subjects)].map((_, idx) => (
					<div key={idx}>
						<Divider content={`Subject ${idx + 1} Details`} horizontal inverted={theme} />

						<Form.Group>
							<Form.Input
								fluid
								required
								pattern="[\w\s\(\).,-]+"
								name={`name` + idx}
								label="Subject Name"
								placeholder="Full name of the subject"
								onChange={onChange}
							/>
							<Form.Select
								name={`teacher` + idx}
								label="Subject Teacher"
								placeholder="Assign a subject teacher"
								options={teachers.map(x => {
									return { text: getName(x.name), value: x._id }
								})}
								onChange={onChange}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Input
								required
								pattern="[\w-]+"
								name={`subjectCode` + idx}
								label="Subject Code"
								placeholder="Subject Code"
								onChange={onChange}
							/>
							<Form.Input
								pattern="[\w-]+"
								name={`uniSubjectCode` + idx}
								label="University Subject Code"
								placeholder="University Subject Code"
								onChange={onChange}
							/>
							<Form.Button
								fluid
								type="button"
								color="twitter"
								label="Language"
								inverted={theme}
								content={variables[`language` + idx] || `English`}
								onClick={() =>
									setVariables({
										...variables,
										[`language` + idx]:
											variables[`language` + idx] === `Hindi` ? `English` : `Hindi`,
									})
								}
							/>
						</Form.Group>
					</div>
				))}

				<Divider />

				<Form.Group>
					{subjects > 1 && (
						<Form.Button
							fluid
							width={2}
							color="red"
							type="button"
							inverted={theme}
							content={<Icon name="delete" />}
							onClick={() => {
								setVariables(variables => {
									for (const variable in variables)
										variable.endsWith(subjects) && delete variables[variable]
									return variables
								})
								setSubjects(subjects => --subjects)
							}}
						/>
					)}

					<Form.Button
						fluid
						width={2}
						color="green"
						type="button"
						inverted={theme}
						content={<Icon name="add" />}
						onClick={() =>
							subjects <= 9
								? setSubjects(subjects => ++subjects)
								: toast.warning(`You can only add maximum of 10 Subjects at a time`)
						}
					/>

					<Form.Button
						fluid
						animated="fade"
						inverted={theme}
						disabled={!(`class` in variables) || !(`name0` in variables)}
						content={
							<>
								<Button.Content visible content={<Icon name="save" />} />
								<Button.Content hidden content="Save" />
							</>
						}
						onClick={() => setConfirm(true)}
					/>
				</Form.Group>
			</Form>

			<AreYouSure
				open={confirm}
				theme={theme}
				onConfirm={addSubjects}
				onCancel={() => setConfirm(false)}
				content={`This will add ${subjects} subjects to ${variables.class} class`}
			/>
		</>
	)
}

export default AddSubjects
