import { Table, Modal, Divider, Button, Form, Icon } from "semantic-ui-react"
import { useLazyQuery, useMutation } from "@apollo/react-hooks"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import React, { useState } from "react"

import QUERY_TEACHERS from "../../queries/query/listOfTeachers"
import UPDATE_SUBJECT from "../../queries/mutation/updateSubject"
import DELETE_SUBJECT from "../../queries/mutation/deleteSubject"

import { getName, getTime } from "../shared/helpers"
import MutationError from "../shared/MutationError"
import AreYouSure from "../shared/AreYouSure"

const Subjects = ({ location, theme, subjects, department }) => {
	const [column, setColumn] = useState(1)
	const [modal, setModal] = useState(false)
	const [selected, setSelected] = useState({})
	const [variables, setVariables] = useState({})
	const [deleteModal, setDeleteModal] = useState(false)
	const [direction, setDirection] = useState(`ascending`)

	const [getTeachers, { loading, data }] = useLazyQuery(QUERY_TEACHERS, {
		variables: { department },
	})

	const [deleteSubject] = useMutation(DELETE_SUBJECT, {
		update: () => {
			toast.success(<h3>Subject Deleted</h3>)
			location.reload()
		},
		onError: e => MutationError(e),
		variables,
	})

	const [updateSubject, { loading: updatingSubject }] = useMutation(UPDATE_SUBJECT, {
		update: () => {
			toast.success(<h3>Subject Updated</h3>)
			setModal(modal => !modal)
		},
		onError: e => MutationError(e),
		variables,
	})

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const sortColumn = field => {
		if (column === field) {
			subjects.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					subjects.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					break
				case 2:
					subjects.sort((p, n) => (p.subjectCode < n.subjectCode ? -1 : 1))
					break
				case 3:
					subjects.sort((p, n) => {
						if (p.uniSubjectCode && n.uniSubjectCode)
							return p.uniSubjectCode < n.uniSubjectCode ? -1 : 1
						else return null
					})
					break
				case 4:
					subjects.sort((p, n) => (p.language < n.language ? -1 : 1))
					break
				case 5:
					subjects.sort((p, n) => {
						if (p.teacher && n.teacher)
							return p.teacher.name.first.toLowerCase() < n.teacher.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 6:
					subjects.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 7:
					subjects.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 8:
					subjects.sort((p, n) => {
						if (p.updatedBy && n.updatedBy)
							return p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 9:
					subjects.sort((p, n) => p.updatedAt - n.updatedAt)
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
								content="Subject Code"
							/>
							<Table.HeaderCell
								sorted={column === 3 ? direction : null}
								onClick={() => sortColumn(3)}
								content="University Subject Code"
							/>
							<Table.HeaderCell
								sorted={column === 4 ? direction : null}
								onClick={() => sortColumn(4)}
								content="Language"
							/>
							<Table.HeaderCell
								sorted={column === 5 ? direction : null}
								onClick={() => sortColumn(5)}
								content="Teacher"
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
							<Table.HeaderCell content="Edit" />
							<Table.HeaderCell content="Delete" />
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{subjects.map((subject, idx) => (
							<Table.Row key={idx}>
								<Table.Cell textAlign="center" content={idx + 1} />
								<Table.Cell content={subject.name} />
								<Table.Cell content={subject.subjectCode} />
								<Table.Cell content={subject.uniSubjectCode} />
								<Table.Cell content={subject.language} />
								<Table.Cell
									selectable
									content={
										subject.teacher && (
											<Link to={`teacher/` + subject.teacher.username}>
												{getName(subject.teacher.name)}
											</Link>
										)
									}
								/>
								<Table.Cell
									selectable
									content={
										<Link to={`teacher/` + subject.createdBy.username}>
											{getName(subject.createdBy.name)}
										</Link>
									}
								/>
								<Table.Cell content={getTime(subject.createdAt)} />
								<Table.Cell
									selectable
									content={
										subject.updatedBy && (
											<Link to={`teacher/` + subject.updatedBy.username}>
												{getName(subject.updatedBy.name)}
											</Link>
										)
									}
								/>
								<Table.Cell content={getTime(subject.updatedAt)} />
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} name="pencil square" />}
									onClick={() => {
										setSelected({ ...subjects.filter(x => x._id === subject._id)[0] })
										setVariables({ _id: subject._id })
										setModal(modal => !modal)
									}}
									style={{ cursor: `pointer` }}
								/>
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} color="red" name="delete" />}
									onClick={() => {
										setSelected({ ...subjects.filter(x => x._id === subject._id)[0] })
										setVariables({ _id: subject._id })
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
				<Modal.Header content="Update Subject" />
				<Modal.Content
					content={
						<Form
							widths="equal"
							loading={updatingSubject}
							onSubmit={e => {
								e.preventDefault()
								updateSubject()
							}}
						>
							<Form.Group>
								<Form.Input
									onChange={onChange}
									value={variables.name || selected.name || ``}
									label="Name"
									name="name"
								/>
								<Form.Input
									onChange={onChange}
									value={variables.subjectCode || selected.subjectCode || ``}
									label="Subject Code"
									name="subjectCode"
								/>
								<Form.Input
									onChange={onChange}
									value={variables.uniSubjectCode || selected.uniSubjectCode || ``}
									label="University Subject Code"
									name="uniSubjectCode"
								/>
							</Form.Group>
							<Form.Group>
								<Form.Button
									fluid
									type="button"
									color="twitter"
									label="Language"
									content={variables.language || `English`}
									onClick={() =>
										setVariables({
											...variables,
											language: variables.language === `Hindi` ? `English` : `Hindi`,
										})
									}
								/>
								<Form.Select
									loading={loading}
									onChange={onChange}
									value={variables.teacher || (selected.teacher && selected.teacher._id) || ``}
									onClick={getTeachers}
									label="Subject Teacher"
									name="teacher"
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
				onConfirm={deleteSubject}
				onCancel={() => setDeleteModal(deleteModal => !deleteModal)}
				content={`This will delete ${
					variables._id && subjects.filter(x => x._id === variables._id)[0].name
				} subject from database.`}
			/>
		</>
	)
}

export default Subjects
