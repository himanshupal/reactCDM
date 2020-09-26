import React, { useState } from "react"
import { toast } from "react-toastify"
import { Modal, Form, Dimmer, Button } from "semantic-ui-react"
import { useLazyQuery, useMutation } from "@apollo/react-hooks"

import MDEditor from "@uiw/react-md-editor"
import NOTICES from "../../queries/query/notices"
import ADD_NOTICE from "../../queries/mutation/addNotice"
import UPDATE_NOTICE from "../../queries/mutation/updateNotice"
import MutationError from "../shared/MutationError"

import CLASSES from "../../queries/query/classesNameOnly"
import COURSES from "../../queries/query/coursesOnly"
import DEPARTMENTS from "../../queries/query/listOfDepartments"

const NoticeModal = ({ open, close, theme, user, update }) => {
	const [variables, setVariables] = useState({})

	const [addNotice, { loading: savingNotice }] = useMutation(update ? UPDATE_NOTICE : ADD_NOTICE, {
		update: (proxy, { data: updateData }) => {
			try {
				if (!update) {
					const data = proxy.readQuery({ query: NOTICES })
					data.notices.push(updateData.addNotice)
					proxy.writeQuery({ query: NOTICES, data })
				}
			} catch (error) {
				console.error(error)
			}
			toast.success(<h3>Notice {update ? `Updated` : `Created`}</h3>)
			close()
		},
		onError: e => MutationError(e),
		variables: update ? { ...variables, _id: update._id } : variables,
	})

	const [getClasses, { loading: loadingClasses, data: newClasses }] = useLazyQuery(CLASSES)
	const [getCourses, { loading: loadingCourses, data: newCourses }] = useLazyQuery(COURSES)
	const [getDepartments, { loading: loadingDepartments, data: newDepartments }] = useLazyQuery(
		DEPARTMENTS
	)

	const scopeOptions = [
		{ text: `Class`, value: `Class` },
		{ text: `Course`, value: `Course` },
	]

	return (
		<Modal open={open} onClose={close}>
			<Modal.Header content="Create New Notice" />
			<Modal.Content>
				<Dimmer active={savingNotice} inverted={!theme} />
				<Form widths="equal">
					<Form.Group>
						<Form.Input
							label="Subject"
							value={variables.subject || (update && update.subject)}
							onChange={(_, { value }) => setVariables({ ...variables, subject: value })}
						/>
						<Form.Select
							label="Scope"
							value={variables.scope}
							onChange={(_, { value }) => {
								if (value === `Class`) getCourses()
								else if (value === `Course` || value === `Department`) getDepartments()
								setVariables({ ...variables, scope: value })
							}}
							options={
								user && user.access === `Director`
									? [...scopeOptions, { text: `Department`, value: `Department` }]
									: scopeOptions
							}
						/>
						{variables.scope === `Department` && (
							<Form.Select
								label="Select Department"
								loading={loadingDepartments}
								onChange={(_, { value }) => setVariables({ ...variables, validFor: value })}
								options={
									newDepartments
										? newDepartments.departments.map(x => {
												return { text: x.name, value: x.name }
										  })
										: []
								}
							/>
						)}
					</Form.Group>
					{(variables.scope === `Course` || variables.scope === `Class`) && (
						<Form.Group>
							<Form.Select
								label={`Select ${variables.scope === `Course` ? `Department` : `Course`}`}
								loading={loadingCourses || loadingDepartments}
								options={
									newDepartments && variables.scope === `Course`
										? newDepartments.departments.map(x => {
												return { text: x.name, value: x._id }
										  })
										: newCourses
										? newCourses.courses.map(x => {
												return { text: x.name, value: x._id }
										  })
										: []
								}
								onChange={(_, { value }) => {
									if (variables.scope === `Course`) getCourses({ variables: { department: value } })
									else getClasses({ variables: { course: value } })
								}}
							/>
							<Form.Select
								label={`Select ${variables.scope === `Class` ? `Class` : `Course`}`}
								loading={loadingCourses || loadingClasses}
								options={
									newCourses && variables.scope === `Course`
										? newCourses.courses.map(x => {
												return { text: x.name, value: x.name }
										  })
										: newClasses
										? newClasses.classes.map(x => {
												return { text: x.name, value: x.name }
										  })
										: []
								}
								onChange={(_, { value }) => setVariables({ ...variables, validFor: value })}
							/>
						</Form.Group>
					)}
				</Form>
				<MDEditor
					value={variables.description || (update && update.description)}
					onChange={value => setVariables({ ...variables, description: value })}
				/>
			</Modal.Content>
			<Modal.Actions content={<Button content="Save" onClick={addNotice} />} />
		</Modal>
	)
}

export default NoticeModal
