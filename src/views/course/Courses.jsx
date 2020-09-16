import {
	Icon,
	Form,
	Table,
	Modal,
	Dimmer,
	Button,
	Divider,
	Checkbox,
	Dropdown,
} from "semantic-ui-react"

import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"

import ADD_COURSE from "../../queries/mutation/addCourse"
import UPDATE_COURSE from "../../queries/mutation/updateCourse"
import DELETE_COURSE from "../../queries/mutation/deleteCourse"

import QUERY_COURSES from "../../queries/query/courses"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../common/context"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import Error from "../shared/Error"
import Loading from "../shared/Loading"
import AreYouSure from "../shared/AreYouSure"
import constants from "../../common/constants"
import MutationError from "../shared/MutationError"
import { getName, getTime } from "../shared/helpers"

const permitted = [`Director`, `Head of Department`]

const Courses = ({ history, location: { state }, theme }) => {
	const {
		user: { department, access },
	} = useContext(AuthContext)

	const [selectedDepartment, setSelectedDepartment] = useState({})
	const [direction, setDirection] = useState(`ascending`)
	const [deleteModal, setDeleteModal] = useState(false)
	const [variables, setVariables] = useState({})
	const [teachers, setTeachers] = useState([])
	const [courses, setCourses] = useState([])
	const [modal, setModal] = useState(false)
	const [column, setColumn] = useState(1)

	const { loading, error, data } = useQuery(QUERY_COURSES, {
		variables: { department: (state && state._id) || department },
	})

	const [getDepartments, { loading: loadingDepartments, data: list }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [getCourses, { loading: loadingCourses, data: courseList }] = useLazyQuery(QUERY_COURSES)

	const [deleteCourse, { loading: deletingCourse }] = useMutation(DELETE_COURSE, {
		update: () => {
			setDeleteModal(false)
			window.location.reload()
		},
		onError: e => MutationError(e),
		variables,
	})

	const [saveCourse, { loading: savingCourse }] = useMutation(
		variables._id ? UPDATE_COURSE : ADD_COURSE,
		{
			update: (proxy, { data: returnData }) => {
				try {
					const dpt =
						(selectedDepartment && selectedDepartment._id) || (state && state._id) || department
					const data = proxy.readQuery({
						query: QUERY_COURSES,
						variables: { department: dpt },
					})
					if (variables._id) {
						data.courses
							.filter(x => x._id !== returnData.updateCourse._id)
							.push(returnData.updateCourse)
					} else data.courses.push(returnData.addCourse)
					data.courses.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					proxy.writeQuery({ query: QUERY_COURSES, variables: { department: dpt }, data })
				} catch (error) {
					console.error(error)
				}
				toast.success(<h3>{variables._id ? `Course Updated` : `Course Saved`} ✔</h3>)
				toggle()
			},
			onError: e => MutationError(e),
			variables: variables._id
				? variables
				: {
						...variables,
						department:
							(selectedDepartment && selectedDepartment._id) || (state && state._id) || department,
				  },
		}
	)

	useEffect(() => {
		if (courseList) {
			setCourses(courseList.courses)
			setTeachers(courseList.teachers)
		} else if (data) {
			setCourses(data.courses)
			setTeachers(data.courses)
		}
	}, [data, courseList])

	if (loading) return <Loading />
	if (error) return <Error />

	const getDuration = duration => {
		const [year] = duration.match(/\d/)
		return Number(year) === 1 ? `${year} year` : `${year} years`
	}

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const toggle = () => {
		setVariables({})
		setModal(modal => !modal)
	}

	const sortColumn = field => {
		if (column === field) {
			courses.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					courses.sort((p, n) => (p.identifier.toLowerCase() < n.identifier.toLowerCase() ? -1 : 1))
					break
				case 2:
					courses.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					break
				case 3:
					courses.sort((p, n) =>
						p.duration && n.duration && p.duration.split(/\s/)[1] < n.duration.split(/\s/)[1]
							? -1
							: 1
					)
					break
				case 4:
					courses.sort(x => (x.semesterBased ? -1 : 1))
					break
				case 5:
					courses.sort((p, n) =>
						p.headOfDepartment &&
						n.headOfDepartment &&
						p.headOfDepartment.name.first.toLowerCase() <
							n.headOfDepartment.name.first.toLowerCase()
							? -1
							: 1
					)
					break
				case 6:
					courses.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 7:
					courses.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 8:
					courses.sort((p, n) =>
						p.updatedBy &&
						n.updatedBy &&
						p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
							? -1
							: 1
					)
					break
				case 9:
					courses.sort((p, n) => p.updatedAt - n.updatedAt)
					break
				default:
					return
			}
		}
	}

	return (
		<>
			<h1>Courses</h1>
			<Dimmer active={loadingCourses || deletingCourse || savingCourse} inverted={!theme} />
			<Divider />
			{access === `Director` && (
				<Dropdown
					fluid
					selection
					onClick={getDepartments}
					loading={loadingDepartments}
					onChange={(_, { value }) => {
						const { _id, name } = list.departments.filter(x => x._id === value)[0]
						setSelectedDepartment({ _id, name: name.toLowerCase() })
						getCourses({ variables: { department: value } })
					}}
					placeholder="Change Department"
					style={{ marginBottom: `1rem` }}
					options={
						list
							? list.departments.map(x => {
									return { text: x.name, value: x._id }
							  })
							: []
					}
				/>
			)}
			{courses && courses.length > 0 ? (
				<>
					<h3 className="highlight">
						{`Showing courses from ${
							selectedDepartment.name || (state && state.name) || `your`
						} department`}
					</h3>
					<div className="table_overflow">
						<Table celled unstackable sortable selectable striped singleLine inverted={theme}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell textAlign="center" content="S.No." />
									<Table.HeaderCell
										sorted={column === 1 ? direction : null}
										onClick={() => sortColumn(1)}
										content="Identifier"
									/>
									<Table.HeaderCell
										sorted={column === 2 ? direction : null}
										onClick={() => sortColumn(2)}
										content="Name"
									/>
									<Table.HeaderCell
										sorted={column === 3 ? direction : null}
										onClick={() => sortColumn(3)}
										content="Duration"
									/>
									<Table.HeaderCell
										sorted={column === 4 ? direction : null}
										onClick={() => sortColumn(4)}
										content="Semester based"
									/>
									<Table.HeaderCell
										sorted={column === 5 ? direction : null}
										onClick={() => sortColumn(5)}
										content="Head of Department"
									/>
									<Table.HeaderCell
										sorted={column === 6 ? direction : null}
										onClick={() => sortColumn(6)}
										content="Added by"
									/>
									<Table.HeaderCell
										sorted={column === 7 ? direction : null}
										onClick={() => sortColumn(7)}
										content="Added on"
									/>
									<Table.HeaderCell
										sorted={column === 8 ? direction : null}
										onClick={() => sortColumn(8)}
										content="Updated by"
									/>
									<Table.HeaderCell
										sorted={column === 9 ? direction : null}
										onClick={() => sortColumn(9)}
										content="Updated on"
									/>
									{permitted.includes(access) && (
										<>
											<Table.HeaderCell content="Edit" />
											<Table.HeaderCell content="Delete" />
										</>
									)}
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{courses.map((course, idx) => (
									<Table.Row key={idx}>
										<Table.Cell content={idx + 1} textAlign="center" />
										<Table.Cell
											selectable
											content={
												<Link to="/classes" onClick={e => e.preventDefault()}>
													{course.identifier}
												</Link>
											}
											onClick={() =>
												history.push(`/classes`, {
													_id: course._id,
													name: course.name.toLowerCase(),
												})
											}
										/>
										<Table.Cell
											selectable
											content={
												<Link to="/classes" onClick={e => e.preventDefault()}>
													{course.name}
												</Link>
											}
											onClick={() =>
												history.push(`/classes`, {
													_id: course._id,
													name: course.name.toLowerCase(),
												})
											}
										/>
										<Table.Cell content={course.duration && getDuration(course.duration)} />
										<Table.Cell content={course.semesterBased ? `Yes` : `No`} />
										<Table.Cell
											selectable
											content={
												course.headOfDepartment && (
													<Link to={`teacher/` + course.headOfDepartment.username}>
														{getName(course.headOfDepartment.name)}
													</Link>
												)
											}
										/>
										<Table.Cell
											selectable
											content={
												<Link to={`teacher/` + course.createdBy.username}>
													{getName(course.createdBy.name)}
												</Link>
											}
										/>
										<Table.Cell content={getTime(course.createdAt)} />
										<Table.Cell
											selectable
											content={
												course.updatedBy && (
													<Link to={`teacher/` + course.updatedBy.username}>
														{getName(course.updatedBy.name)}
													</Link>
												)
											}
										/>
										<Table.Cell content={getTime(course.updatedAt)} />
										{permitted.includes(access) && (
											<>
												<Table.Cell
													textAlign="center"
													content={<Icon inverted={theme} name="pencil square" />}
													onClick={() => {
														setVariables({ _id: course._id })
														setModal(modal => !modal)
													}}
													style={{ cursor: `pointer` }}
												/>
												<Table.Cell
													textAlign="center"
													content={<Icon inverted={theme} color="red" name="delete" />}
													onClick={() => {
														setVariables({ _id: course._id })
														setDeleteModal(true)
													}}
													style={{ cursor: `pointer` }}
												/>
											</>
										)}
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
				</>
			) : (
				<h3 className="highlight">There are no courses in this departments yet</h3>
			)}

			{permitted.includes(access) && (
				<Button
					fluid
					type="button"
					animated="fade"
					inverted={theme}
					onClick={toggle}
					content={
						<>
							<Button.Content visible content={<Icon name="add circle" />} />
							<Button.Content hidden content="Add New Course" />
						</>
					}
				/>
			)}

			<Modal open={modal} onClose={toggle} size="small">
				<Modal.Header content={variables._id ? `Update Course` : `Add Course`} />
				<Modal.Content
					content={
						<Form
							widths="equal"
							loading={savingCourse}
							onSubmit={e => {
								e.preventDefault()
								saveCourse()
							}}
						>
							<Form.Group>
								<Form.Input
									width={5}
									required
									onChange={onChange}
									value={
										variables.identifier ||
										(variables._id && courses.filter(x => x._id === variables._id)[0].identifier) ||
										``
									}
									label="Identifier"
									name="identifier"
								/>
								<Form.Input
									width={12}
									required
									onChange={onChange}
									value={
										variables.name ||
										(variables._id && courses.filter(x => x._id === variables._id)[0].name) ||
										``
									}
									label="Name"
									name="name"
								/>
							</Form.Group>
							<Form.Group>
								<Form.Select
									required
									onChange={onChange}
									value={
										variables.duration ||
										(variables._id && courses.filter(x => x._id === variables._id)[0].duration) ||
										``
									}
									label="Duration"
									name="duration"
									options={constants.duration}
								/>
								<Form.Select
									onChange={onChange}
									value={
										variables.headOfDepartment ||
										(variables._id &&
											courses.filter(x => x._id === variables._id)[0].headOfDepartment &&
											courses.filter(x => x._id === variables._id)[0].headOfDepartment._id) ||
										``
									}
									label="Head of Department"
									name="headOfDepartment"
									options={teachers.map(x => {
										return {
											text: getName(x.name),
											value: x._id,
										}
									})}
								/>
								<Form.Button
									fluid
									color="grey"
									type="button"
									onClick={() =>
										setVariables({
											...variables,
											semesterBased: variables._id
												? courses.filter(x => x._id === variables._id)[0].semesterBased
													? variables.semesterBased === undefined
														? !!variables.semesterBased
														: !variables.semesterBased
													: !!(
															!variables.semesterBased ^
															courses.filter(x => x._id === variables._id)[0].semesterBased
													  )
												: !variables.semesterBased,
										})
									}
									label="Semester based"
									name="semesterBased"
									content={
										variables.semesterBased === undefined
											? variables._id &&
											  courses.filter(x => x._id === variables._id)[0].semesterBased
												? `Yes`
												: `No`
											: variables.semesterBased
											? `Yes`
											: `No`
									}
								/>
							</Form.Group>
							<Divider />
							<Form.Button
								fluid
								animated="fade"
								disabled={variables._id && Object.keys(variables).length < 2}
								content={
									<>
										<Button.Content visible content={<Icon name="save" />} />
										<Button.Content hidden content={variables._id ? `Update` : `Add`} />
									</>
								}
							/>
						</Form>
					}
				/>
			</Modal>

			<AreYouSure
				onCancel={() => {
					setDeleteModal(false)
					setVariables({})
				}}
				open={deleteModal}
				onConfirm={deleteCourse}
				theme={theme}
				content={
					<div className="distributed_ends">
						Delete all data including Classes, Students record etc. ?
						<Checkbox
							slider
							onClick={() => setVariables({ ...variables, classes: !variables.classes })}
						/>
					</div>
				}
			/>
		</>
	)
}

export default Courses
