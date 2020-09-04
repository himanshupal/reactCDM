import { Segment, Form, Divider, Button, Icon, Dimmer, Popup } from "semantic-ui-react"
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks"

import QUERY_CLASSES from "../../queries/query/classes"
import QUERY_COURSES from "../../queries/query/listOfCourses"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import NEW_SESSION from "../../queries/mutation/newSession"

import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../common/context"

import MutationError from "../shared/MutationError"
import AreYouSure from "../shared/AreYouSure"
import Loading from "../shared/Loading"
import Error from "../shared/Error"

import { getName } from "../shared/helpers"
import { toast } from "react-toastify"

import SingleClass from "./SingleClass"

const NewSesssion = ({ theme }) => {
	const {
		user: { department, access },
	} = useContext(AuthContext)

	const [course, setCourse] = useState({})
	const [modal, setModal] = useState(false)
	const [courses, setCourses] = useState([])
	const [teachers, setTeachers] = useState([])
	const [variables, setVariables] = useState({})
	const [override, setOverride] = useState(false)
	const [session, setSession] = useState(new Date().getMonth() < 6) // TO EVEN => TRUE

	const { loading, error, data } = useQuery(QUERY_COURSES, { variables: { department } })

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [newSession, { loading: savingSession }] = useMutation(NEW_SESSION, {
		update: (proxy, { data: { newSession } }) => {
			try {
				// const data = proxy.readQuery({
				// 	query: QUERY_CLASSES,
				// 	variables: { course: variables.course },
				// })
				// data.classes.push(...newSession)

				proxy.writeQuery({
					query: QUERY_CLASSES,
					variables: { course: variables.course },
					data: { classes: newSession },
				})
			} catch (error) {
				console.error(error)
			}
			toast.success(<h3>Session Saved ✔</h3>)
			setVariables({ course: variables.course })
			setModal(false)

			// history.push(`/classes`)
		},
		onError: e => MutationError(e),
		variables,
	})

	const timeElapsed = new Date().getFullYear() - new Date(course.createdAt).getFullYear()

	useEffect(() => {
		if (courseList) {
			setCourses(courseList.courses)
			setTeachers(courseList.teachers)
		} else if (data) {
			setCourses(data.courses)
			setTeachers(data.teachers)
		}
	}, [data, courseList])

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<>
			<h1 className="distributed_ends">
				<Dimmer active={savingSession} inverted={!theme} />
				<div>New Session</div>
				<div className="floated right">
					{variables.course && timeElapsed < course.duration && (
						<Popup
							style={{ opacity: `93%` }}
							trigger={
								<Button
									onClick={() => {
										setVariables({ course: variables.course })
										setOverride(override => !override)
									}}
									icon="flag"
									color={override ? `red` : theme ? `black` : `brown`}
								/>
							}
							content="Currently the system hides some classes if the course is introduced recently, use this flag to OVERRIDE this feature"
							inverted={theme}
						/>
					)}
					{course.semesterBased && (
						<Button
							color={theme ? `black` : `grey`}
							size="medium"
							onClick={() => {
								setVariables({ course: variables.course })
								setSession(session => !session)
							}}
						>
							{session ? `To Even (Update Classes)` : `To Odd (Add New Class)`}
						</Button>
					)}
				</div>
			</h1>
			<Divider />
			<Form
				widths="equal"
				inverted={theme}
				onSubmit={e => {
					setModal(true)
					e.preventDefault()
				}}
			>
				<Form.Group>
					{access === `Director` && (
						<Form.Select
							fluid
							onClick={getDepartments}
							label="Change Department"
							loading={loadingDepartments}
							placeholder="Select Department to get list of courses"
							options={
								list
									? list.departments.map(x => {
											return { text: x.name, value: x._id }
									  })
									: []
							}
							onChange={(_, { value }) => getCourses({ variables: { department: value } })}
						/>
					)}
					<Form.Select
						fluid
						required
						label="Select Course"
						loading={loadingCourses}
						placeholder="Select a Course to change session of"
						options={
							courses
								? courses.map(x => {
										return { text: x.name, value: x._id }
								  })
								: []
						}
						onChange={(_, { value }) => {
							setVariables({ course: value })
							const [course] = courses.filter(x => x._id === value)
							setCourse({ ...course, duration: Number(course.duration.match(/\d/)[0]) })
						}}
					/>
				</Form.Group>

				{variables.course && (
					<Segment.Group>
						{[
							...Array(
								timeElapsed < course.duration && !override
									? timeElapsed + 1
									: session
									? course.duration
									: course.duration + 1
							),
						].map((_, idx) => (
							<SingleClass
								key={idx}
								loop={idx}
								theme={theme}
								course={course}
								session={session}
								variables={variables}
								setVariables={setVariables}
								teachers={teachers.map(x => {
									return { text: getName(x.name), value: x._id }
								})}
							/>
						))}
					</Segment.Group>
				)}

				<Form.Button
					fluid
					animated="fade"
					disabled={!variables.course}
					content={
						<>
							<Button.Content visible content={<Icon name="save" />} />
							<Button.Content hidden content="Change Session" />
						</>
					}
				/>
			</Form>

			<AreYouSure
				theme={theme}
				open={modal}
				onConfirm={newSession}
				onCancel={() => setModal(false)}
				content={`This transaction will add new Classes to ${course.name} course.`}
			/>
		</>
	)
}

export default NewSesssion
