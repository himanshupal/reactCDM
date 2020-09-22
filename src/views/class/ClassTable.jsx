import { Checkbox, Table, Icon, Modal, Form, Divider, Button } from "semantic-ui-react"
import { useLazyQuery, useMutation } from "@apollo/react-hooks"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import React, { useState } from "react"

import QUERY_TEACHERS from "../../queries/query/listOfTeachers"
import UPDATE_CLASS from "../../queries/mutation/updateClass"
import DELETE_CLASS from "../../queries/mutation/deleteClass"

import { getName, getDate, getTime } from "../shared/helpers"
import MutationError from "../shared/MutationError"
import AreYouSure from "../shared/AreYouSure"

const ClassTable = ({ history, location, getSubjects, department, classes, theme }) => {
	const [column, setColumn] = useState(1)
	const [modal, setModal] = useState(false)
	const [selected, setSelected] = useState({})
	const [variables, setVariables] = useState({})
	const [deleteModal, setDeleteModal] = useState(false)
	const [direction, setDirection] = useState(`ascending`)

	const [getTeachers, { loading, data }] = useLazyQuery(QUERY_TEACHERS, {
		variables: { department },
	})

	const [deleteClass] = useMutation(DELETE_CLASS, {
		update: () => {
			toast.success(<h3>Class Deleted</h3>)
			location.reload()
		},
		onError: e => MutationError(e),
		variables,
	})

	const [updateClass, { loading: updatingClass }] = useMutation(UPDATE_CLASS, {
		update: () => {
			toast.success(<h3>Class Updated</h3>)
			setModal(modal => !modal)
		},
		onError: e => MutationError(e),
		variables,
	})

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const sortColumn = field => {
		if (column === field) {
			classes.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					classes.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					break
				case 2:
					classes.sort((p, n) => {
						if (p.totalStudents && n.totalStudents)
							return p.totalStudents < n.totalStudents ? -1 : 1
						else return null
					})
					break
				case 3:
					classes.sort((p, n) => {
						if (p.sessionStart && n.sessionStart) return p.sessionStart < n.sessionStart ? -1 : 1
						else return null
					})
					break
				case 4:
					classes.sort((p, n) => {
						if (p.sessionEnd && n.sessionEnd) return p.sessionEnd < n.sessionEnd ? -1 : 1
						else return null
					})
					break
				case 5:
					classes.sort((p, n) => {
						if (p.classTeacher && n.classTeacher)
							return p.classTeacher.name.first.toLowerCase() <
								n.classTeacher.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 6:
					classes.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 7:
					classes.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 8:
					classes.sort((p, n) => {
						if (p.updatedBy && n.updatedBy)
							return p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 9:
					classes.sort((p, n) => p.updatedAt - n.updatedAt)
					break
				default:
					return
			}
		}
	}

	return (
		<>
			<div className="table_overflow">
				<Table celled unstackable sortable selectable striped singleLine inverted={theme}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell textAlign="center" content="S.No." />
							<Table.HeaderCell
								sorted={column === 1 ? direction : null}
								onClick={() => sortColumn(1)}
								content="Name"
							/>
							<Table.HeaderCell
								sorted={column === 2 ? direction : null}
								onClick={() => sortColumn(2)}
								content="No. of Students"
							/>
							<Table.HeaderCell
								sorted={column === 3 ? direction : null}
								onClick={() => sortColumn(3)}
								content="Session Start"
							/>
							<Table.HeaderCell
								sorted={column === 4 ? direction : null}
								onClick={() => sortColumn(4)}
								content="Session End"
							/>
							<Table.HeaderCell
								sorted={column === 5 ? direction : null}
								onClick={() => sortColumn(5)}
								content="Class Teacher"
							/>
							<Table.HeaderCell textAlign="center" content="Attendence" colSpan={2} />
							<Table.HeaderCell textAlign="center" content="Time Table" colSpan={2} />
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
							<Table.HeaderCell content="Edit" />
							<Table.HeaderCell content="Delete" />
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{classes.map((cls, idx) => (
							<Table.Row key={idx}>
								<Table.Cell textAlign="center" content={idx + 1} />
								<Table.Cell
									selectable
									onClick={() => getSubjects({ variables: { class: cls.name } })}
									content={
										<Link to="#" onClick={e => e.preventDefault()}>
											{cls.name}
										</Link>
									}
								/>
								<Table.Cell
									selectable
									textAlign="center"
									onClick={() => history.push(`/students`, { _id: cls._id })}
									content={
										<Link to="/students" onClick={e => e.preventDefault()}>
											{cls.totalStudents}
										</Link>
									}
								/>
								<Table.Cell content={getDate(cls.sessionStart)} />
								<Table.Cell content={getDate(cls.sessionEnd)} />
								<Table.Cell
									selectable
									content={
										cls.classTeacher && (
											<Link to={`teacher/` + cls.classTeacher.username}>
												{getName(cls.classTeacher.name)}
											</Link>
										)
									}
								/>
								<Table.Cell
									content={
										<Button
											fluid
											size="tiny"
											animated="fade"
											onClick={() => history.push(`/attendence`, cls._id)}
											content={
												<>
													<Button.Content visible content={<Icon name="list" />} />
													<Button.Content hidden content="Today" />
												</>
											}
										/>
									}
								/>
								<Table.Cell
									content={
										<Button
											fluid
											size="tiny"
											animated="fade"
											onClick={() => history.push(`/attendencemonth`, cls._id)}
											content={
												<>
													<Button.Content visible content={<Icon name="calendar" />} />
													<Button.Content hidden content="Month" />
												</>
											}
										/>
									}
								/>
								<Table.Cell
									content={
										<Button
											fluid
											size="tiny"
											animated="fade"
											onClick={() => history.push(`/timetable`, cls._id)}
											content={
												<>
													<Button.Content visible content={<Icon name="eye" />} />
													<Button.Content hidden content="View" />
												</>
											}
										/>
									}
								/>
								<Table.Cell
									content={
										<Button
											fluid
											size="tiny"
											animated="fade"
											onClick={() => history.push(`/edittimetable`, cls._id)}
											content={
												<>
													<Button.Content visible content={<Icon name="edit" />} />
													<Button.Content hidden content="Edit" />
												</>
											}
										/>
									}
								/>
								<Table.Cell
									selectable
									content={
										<Link to={`teacher/` + cls.createdBy.username}>
											{getName(cls.createdBy.name)}
										</Link>
									}
								/>
								<Table.Cell content={getTime(cls.createdAt)} />
								<Table.Cell
									selectable
									content={
										cls.updatedBy && (
											<Link to={`teacher/` + cls.updatedBy.username}>
												{getName(cls.updatedBy.name)}
											</Link>
										)
									}
								/>
								<Table.Cell content={getTime(cls.updatedAt)} />
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} name="pencil square" />}
									onClick={() => {
										setSelected({ ...classes.filter(x => x._id === cls._id)[0] })
										setVariables({ _id: cls._id })
										setModal(modal => !modal)
									}}
									style={{ cursor: `pointer` }}
								/>
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} color="red" name="delete" />}
									onClick={() => {
										setSelected({ ...classes.filter(x => x._id === cls._id)[0] })
										setVariables({ _id: cls._id })
										setDeleteModal(deleteModal => !deleteModal)
									}}
									style={{ cursor: `pointer` }}
								/>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>

			<Modal open={modal} onClose={() => setModal(modal => !modal)} size="small">
				<Modal.Header content="Update Class" />
				<Modal.Content
					content={
						<Form
							widths="equal"
							loading={updatingClass}
							onSubmit={e => {
								e.preventDefault()
								updateClass()
							}}
						>
							<Form.Group>
								<Form.Input
									onChange={onChange}
									value={variables.name || selected.name || ``}
									label="Name"
									name="name"
								/>
								<Form.Select
									loading={loading}
									onChange={onChange}
									value={
										variables.classTeacher ||
										(selected.classTeacher && selected.classTeacher._id) ||
										``
									}
									onClick={getTeachers}
									label="Class Teacher"
									name="classTeacher"
									options={
										data
											? data.teachers.map(x => {
													return {
														text: getName(x.name),
														value: x._id,
													}
											  })
											: []
									}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Input
									type="date"
									onChange={onChange}
									value={variables.sessionStart || selected.sessionStart || ``}
									label="Session Start Date"
									name="sessionStart"
								/>
								<Form.Input
									type="date"
									onChange={onChange}
									value={variables.sessionEnd || selected.sessionEnd || ``}
									label="Session End Date"
									name="sessionEnd"
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
										<Button.Content hidden content="Update" />
									</>
								}
							/>
						</Form>
					}
				/>
			</Modal>

			<AreYouSure
				theme={theme}
				open={deleteModal}
				onConfirm={deleteClass}
				onCancel={() => setDeleteModal(deleteModal => !deleteModal)}
				content={
					<div className="distributed_ends">
						{`Delete all data including Students, Notices, Notes etc. of
						${selected.name} class ?`}
						<Checkbox
							slider
							onClick={() => setVariables({ ...variables, data: !variables.classes })}
						/>
					</div>
				}
			/>
		</>
	)
}

export default ClassTable
