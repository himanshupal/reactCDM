import { Form, Button, Divider, Modal, Table, Icon, Dimmer } from "semantic-ui-react"
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks"

import ADD_DEPARTMENT from "../../queries/mutation/addDepartment"
import UPDATE_DEPARTMENT from "../../queries/mutation/updateDepartment"

import QUERY_DEPARTMENTS from "../../queries/query/departments"
import QUERY_TEACHERS from "../../queries/query/listOfTeachers"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

import Loading from "../shared/Loading"
import Error from "../shared/Error"
import { getName, getTime } from "../shared/helpers"
import MutationError from "../shared/MutationError"

const Departments = ({ history, theme }) => {
	const { loading, error, data } = useQuery(QUERY_DEPARTMENTS)
	const [getTeachers, { loading: loadingTeachers, data: teachersList }] = useLazyQuery(
		QUERY_TEACHERS
	)

	const [direction, setDirection] = useState(`ascending`)
	const [variables, setVariables] = useState({})
	const [modal, setModal] = useState(false)
	const [column, setColumn] = useState(1)

	const [saveDepartment, { loading: savingDepartment }] = useMutation(
		variables._id ? UPDATE_DEPARTMENT : ADD_DEPARTMENT,
		{
			update: (proxy, { data: returnData }) => {
				try {
					const data = proxy.readQuery({ query: QUERY_DEPARTMENTS })
					if (variables._id)
						data.departments
							.filter(x => x._id !== returnData.updateDepartment._id)
							.push(returnData.updateDepartment)
					else data.departments.push(returnData.addDepartment)
					data.departments.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					proxy.writeQuery({ query: QUERY_DEPARTMENTS, data })
				} catch (error) {
					console.error(error)
				}
				toast.success(<h3>{variables._id ? `Department Updated` : `Department Saved`} ✔</h3>)
				toggle()
			},
			onError: e => MutationError(e),
			variables,
		}
	)

	if (loading) return <Loading />
	if (error) return <Error />

	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const toggle = () => {
		setVariables({})
		setModal(modal => !modal)
	}

	const sortColumn = field => {
		if (column === field) {
			data.departments.reverse()
			setDirection(direction === `ascending` ? `descending` : `ascending`)
		} else {
			setColumn(field)
			setDirection(`ascending`)
			switch (field) {
				case 1:
					data.departments.sort((p, n) => (p.name.toLowerCase() < n.name.toLowerCase() ? -1 : 1))
					break
				case 2:
					data.departments.sort((p, n) => {
						if (p.director && n.director)
							return p.director.name.first.toLowerCase() < n.director.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 3:
					data.departments.sort((p, n) =>
						p.createdBy.name.first.toLowerCase() < n.createdBy.name.first.toLowerCase() ? -1 : 1
					)
					break
				case 4:
					data.departments.sort((p, n) => p.createdAt - n.createdAt)
					break
				case 5:
					data.departments.sort((p, n) => {
						if (p.updatedBy && n.updatedBy)
							return p.updatedBy.name.first.toLowerCase() < n.updatedBy.name.first.toLowerCase()
								? -1
								: 1
						else return null
					})
					break
				case 6:
					data.departments.sort((p, n) => p.updatedAt - n.updatedAt)
					break
				default:
					return
			}
		}
	}

	return (
		<>
			<h1>Departments</h1>
			<Dimmer active={savingDepartment} inverted={!theme} />
			<Divider />
			{data.departments.length > 0 ? (
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
									content="Director"
								/>
								<Table.HeaderCell
									sorted={column === 3 ? direction : null}
									onClick={() => sortColumn(3)}
									content="Added by"
								/>
								<Table.HeaderCell
									sorted={column === 4 ? direction : null}
									onClick={() => sortColumn(4)}
									content="Added on"
								/>
								<Table.HeaderCell
									sorted={column === 5 ? direction : null}
									onClick={() => sortColumn(5)}
									content="Updated by"
								/>
								<Table.HeaderCell
									sorted={column === 6 ? direction : null}
									onClick={() => sortColumn(6)}
									content="Updated on"
								/>
								<Table.HeaderCell content="Edit" />
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{data.departments.map((department, idx) => (
								<Table.Row key={idx}>
									<Table.Cell content={idx + 1} textAlign="center" />
									<Table.Cell
										selectable
										content={
											<Link to="/courses" onClick={e => e.preventDefault()}>
												{department.name}
											</Link>
										}
										onClick={() =>
											history.push(`/courses`, {
												_id: department._id,
												name: department.name.toLowerCase(),
											})
										}
									/>
									<Table.Cell
										selectable
										content={
											department.director && (
												<Link to={`teacher/` + department.director.username}>
													{getName(department.director.name)}
												</Link>
											)
										}
									/>
									<Table.Cell
										selectable
										content={
											<Link to={`teacher/` + department.createdBy.username}>
												{getName(department.createdBy.name)}
											</Link>
										}
									/>
									<Table.Cell content={getTime(department.createdAt)} />
									<Table.Cell
										selectable
										content={
											department.updatedBy && (
												<Link to={`teacher/` + department.updatedBy.username}>
													{getName(department.updatedBy.name)}
												</Link>
											)
										}
									/>
									<Table.Cell content={department.updatedAt && getTime(department.updatedAt)} />
									<Table.Cell
										textAlign="center"
										content={<Icon inverted={theme} name="pencil square" />}
										onClick={() => {
											getTeachers()
											setModal(modal => !modal)
											setVariables({ ...variables, _id: department._id })
										}}
										style={{ cursor: `pointer` }}
									/>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</div>
			) : (
				<h3 className="highlight">There are no departments in database</h3>
			)}

			<Button
				fluid
				type="button"
				animated="fade"
				inverted={theme}
				onClick={() => {
					getTeachers()
					toggle()
				}}
				content={
					<>
						<Button.Content visible content={<Icon name="add circle" />} />
						<Button.Content hidden content="Add New Department" />
					</>
				}
			/>

			<Modal open={modal} onClose={toggle} size="small">
				<Modal.Header content={variables._id ? `Update Department` : `Add Department`} />
				<Modal.Content
					content={
						<Form
							widths="equal"
							loading={savingDepartment}
							onSubmit={e => {
								e.preventDefault()
								saveDepartment()
							}}
						>
							<Form.Group>
								<Form.Input
									fluid
									required
									label="Name"
									name="name"
									value={
										variables.name ||
										(variables._id &&
											data.departments.filter(x => x._id === variables._id)[0].name) ||
										``
									}
									onChange={onChange}
								/>
								<Form.Select
									fluid
									loading={loadingTeachers}
									label="Director"
									name="director"
									onChange={onChange}
									value={
										variables.director ||
										(variables._id &&
											data.departments.filter(x => x._id === variables._id)[0].director &&
											data.departments.filter(x => x._id === variables._id)[0].director._id) ||
										``
									}
									options={
										teachersList
											? teachersList.teachers.map(x => {
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
								content={
									<>
										<Button.Content visible content={<Icon name="save" />} />
										<Button.Content hidden content={variables._id ? `Update` : `Add`} />
									</>
								}
								disabled={variables._id ? !variables.name && !variables.director : !variables.name}
							/>
						</Form>
					}
				/>
			</Modal>
		</>
	)
}

export default Departments
