import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import { Icon, Table } from "semantic-ui-react"

import DELETE_TEACHER from "../../queries/mutation/deleteTeacher"

import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { getName, getTime, getDate } from "../shared/helpers"

import MutationError from "../shared/MutationError"
import AreYouSure from "../shared/AreYouSure"

const SingleTeacher = ({ history, location, teachers, access, theme }) => {
	const [column, setColumn] = useState(1)
	const [teacher, setTeacher] = useState()
	const [deleteModal, setDeleteModal] = useState(false)
	const [direction, setDirection] = useState(`ascending`)

	const senior = [`Director`, `Head of Department`]

	const [deleteTeacher] = useMutation(DELETE_TEACHER, {
		update: () => {
			toast.success(<h3>Teacher Deleted ✔</h3>)
			setDeleteModal(deleteModal => !deleteModal)
			location.reload()
		},
		onError: e => MutationError(e),
		variables: { _id: teacher && teacher._id },
	})

	const sortColumn = field => {
		if (column === field) {
			teachers.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					teachers.sort((p, n) => (p.name.firsttoLowerCase() < n.name.firsttoLowerCase() ? -1 : 1))
					break
				case 2:
					teachers.sort((p, n) =>
						p.designation.toLowerCase() < n.designation.toLowerCase() ? -1 : 1
					)
					break
				case 3:
					teachers.sort((p, n) =>
						p.classTeacherOf &&
						n.classTeacherOf &&
						p.classTeacherOf.name.toLowerCase() < n.classTeacherOf.name.toLowerCase()
							? -1
							: 1
					)
					break
				case 4:
					teachers.sort((p, n) => (p.dateOfBirth < n.dateOfBirth ? -1 : 1))
					break
				case 5:
					teachers.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 6:
					teachers.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 7:
					teachers.sort((p, n) =>
						p.updatedBy &&
						n.updatedBy &&
						p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
							? -1
							: 1
					)
					break
				case 8:
					teachers.sort((p, n) => p.updatedAt - n.updatedAt)
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
							<Table.HeaderCell content="S.No." />
							<Table.HeaderCell
								sorted={column === 1 ? direction : null}
								onClick={() => sortColumn(1)}
								content="Name"
							/>
							<Table.HeaderCell
								sorted={column === 2 ? direction : null}
								onClick={() => sortColumn(2)}
								content="Designation"
							/>
							<Table.HeaderCell
								sorted={column === 3 ? direction : null}
								onClick={() => sortColumn(3)}
								content="Class Teacher of"
							/>
							<Table.HeaderCell content="Contact" colSpan={2} />
							<Table.HeaderCell
								sorted={column === 4 ? direction : null}
								onClick={() => sortColumn(4)}
								content="Date of Birth"
							/>
							<Table.HeaderCell
								sorted={column === 5 ? direction : null}
								onClick={() => sortColumn(5)}
								content="Added by"
							/>
							<Table.HeaderCell
								sorted={column === 6 ? direction : null}
								onClick={() => sortColumn(6)}
								content="Added on"
							/>
							<Table.HeaderCell
								sorted={column === 7 ? direction : null}
								onClick={() => sortColumn(7)}
								content="Updated by"
							/>
							<Table.HeaderCell
								sorted={column === 8 ? direction : null}
								onClick={() => sortColumn(8)}
								content="Updated on"
							/>
							<Table.HeaderCell content="Edit" />
							<Table.HeaderCell content="Delete" />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{teachers.map((teacher, idx) => (
							<Table.Row key={idx}>
								<Table.Cell textAlign="center" content={idx + 1} />
								<Table.Cell
									selectable
									content={<Link to={`/teacher/` + teacher.username}>{getName(teacher.name)}</Link>}
								/>
								<Table.Cell content={teacher.designation} />
								<Table.Cell content={teacher.classTeacherOf.name} />
								<Table.Cell
									selectable
									content={<a href={`tel:` + teacher.contactNumber}>{teacher.contactNumber}</a>}
								/>
								<Table.Cell
									selectable
									content={<a href={`mailto:` + teacher.email}>{teacher.email}</a>}
								/>
								<Table.Cell content={getDate(teacher.dateOfBirth)} />
								<Table.Cell
									selectable
									content={
										<Link to={`teacher/` + teacher.createdBy.username}>
											{getName(teacher.createdBy.name)}
										</Link>
									}
								/>
								<Table.Cell content={getTime(teacher.createdAt)} />
								<Table.Cell
									selectable
									content={
										teacher.updatedBy && (
											<Link to={`teacher/` + teacher.updatedBy.username}>
												{getName(teacher.updatedBy.name)}
											</Link>
										)
									}
								/>
								<Table.Cell content={getTime(teacher.updatedAt)} />
								{senior.includes(access) && (
									<>
										<Table.Cell
											textAlign="center"
											content={<Icon inverted={theme} name="pencil square" />}
											onClick={() => history.push(`teacher/${teacher.username}/update`)}
											style={{ cursor: `pointer` }}
										/>
										<Table.Cell
											textAlign="center"
											content={<Icon inverted={theme} color="red" name="delete" />}
											onClick={() => {
												setTeacher(teacher)
												setDeleteModal(modal => !modal)
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
			{teacher && (
				<AreYouSure
					theme={theme}
					open={deleteModal}
					onConfirm={deleteTeacher}
					onCancel={() => setDeleteModal(deleteModal => !deleteModal)}
					content={`This will remove ` + getName(teacher.name) + ` along with all his/her data.`}
				/>
			)}
		</>
	)
}

export default SingleTeacher
