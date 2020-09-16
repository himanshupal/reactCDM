import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Icon, Table } from "semantic-ui-react"
import { useMutation } from "@apollo/react-hooks"
import { toast } from "react-toastify"

import DELETE_STUDENT from "../../queries/mutation/deleteStudent"

import { getDate, getName, getTime } from "../shared/helpers"

import AreYouSure from "../shared/AreYouSure"
import MutationError from "../shared/MutationError"

const SingleStudent = ({ history, location, students, theme }) => {
	const [column, setColumn] = useState(1)
	const [student, setStudent] = useState()
	const [deleteModal, setDeleteModal] = useState(false)
	const [direction, setDirection] = useState(`ascending`)

	const [deleteStudent] = useMutation(DELETE_STUDENT, {
		update: () => {
			toast.success(<h3>Student Deleted ✔</h3>)
			setDeleteModal(deleteModal => !deleteModal)
			location.reload()
		},
		onError: e => MutationError(e),
		variables: { _id: student && student._id },
	})

	const sortColumn = field => {
		if (column === field) {
			students.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					students.sort((p, n) =>
						p.rollNumber && n.rollNumber && p.rollNumber < n.rollNumber ? -1 : 1
					)
					break
				case 2:
					students.sort((p, n) =>
						p.name.first.toLowerCase() < n.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 3:
					students.sort((p, n) => (p.dateOfBirth < n.dateOfBirth ? -1 : 1))
					break
				case 4:
					students.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 5:
					students.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 6:
					students.sort((p, n) =>
						p.updatedBy &&
						n.updatedBy &&
						p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
							? -1
							: 1
					)
					break
				case 7:
					students.sort((p, n) => p.updatedAt - n.updatedAt)
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
								content="Roll No."
							/>
							<Table.HeaderCell
								sorted={column === 2 ? direction : null}
								onClick={() => sortColumn(2)}
								content="Name"
							/>
							<Table.HeaderCell
								sorted={column === 3 ? direction : null}
								onClick={() => sortColumn(3)}
								content="Date of Birth"
							/>
							<Table.HeaderCell content="Contact" colSpan={2} />
							<Table.HeaderCell content="Father's Name & Contact" colSpan={2} />
							<Table.HeaderCell
								sorted={column === 4 ? direction : null}
								onClick={() => sortColumn(4)}
								content="Added by"
							/>
							<Table.HeaderCell
								sorted={column === 5 ? direction : null}
								onClick={() => sortColumn(5)}
								content="Added on"
							/>
							<Table.HeaderCell
								sorted={column === 6 ? direction : null}
								onClick={() => sortColumn(6)}
								content="Updated by"
							/>
							<Table.HeaderCell
								sorted={column === 7 ? direction : null}
								onClick={() => sortColumn(7)}
								content="Updated on"
							/>
							<Table.HeaderCell content="Edit" />
							<Table.HeaderCell content="Delete" />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{students.map((student, idx) => (
							<Table.Row key={idx}>
								<Table.Cell textAlign="center" content={idx + 1} />
								<Table.Cell content={student.rollNumber} />
								<Table.Cell
									selectable
									content={<Link to={`/student/` + student.username}>{getName(student.name)}</Link>}
								/>
								<Table.Cell content={getDate(student.dateOfBirth)} />
								<Table.Cell
									selectable
									content={<a href={`tel:` + student.contactNumber}>{student.contactNumber}</a>}
								/>
								<Table.Cell
									selectable
									content={<a href={`mailto:` + student.email}>{student.email}</a>}
								/>
								<Table.Cell content={student.father.name} />
								<Table.Cell
									selectable
									content={
										<a href={`tel:` + student.father.contactNumber}>
											{student.father.contactNumber}
										</a>
									}
								/>
								<Table.Cell
									selectable
									content={
										<Link to={`teacher/` + student.createdBy.username}>
											{getName(student.createdBy.name)}
										</Link>
									}
								/>
								<Table.Cell content={getTime(student.createdAt)} />
								<Table.Cell
									selectable
									content={
										student.updatedBy && (
											<Link to={`teacher/` + student.updatedBy.username}>
												{getName(student.updatedBy.name)}
											</Link>
										)
									}
								/>
								<Table.Cell content={getTime(student.updatedAt)} />
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} name="pencil square" />}
									onClick={() => history.push(`student/${student.username}/update`)}
									style={{ cursor: `pointer` }}
								/>
								<Table.Cell
									textAlign="center"
									content={<Icon inverted={theme} color="red" name="delete" />}
									onClick={() => {
										setStudent(student)
										setDeleteModal(deleteModal => !deleteModal)
									}}
									style={{ cursor: `pointer` }}
								/>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
			{student && (
				<AreYouSure
					theme={theme}
					open={deleteModal}
					onConfirm={deleteStudent}
					onCancel={() => setDeleteModal(deleteModal => !deleteModal)}
					content={`This will remove ` + getName(student.name) + ` along with all his/her data.`}
				/>
			)}
		</>
	)
}

export default SingleStudent
