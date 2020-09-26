import { Dropdown, Divider, Button } from "semantic-ui-react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"
import React, { useState, useEffect, useContext } from "react"

import QUERY_TEACHERS from "../../queries/query/teachers"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import Error from "../shared/Error"
import Loading from "../shared/Loading"
import SingleTeacher from "./SingleTeacher"

const Teachers = ({ theme, history }) => {
	const {
		user: { access, department },
	} = useContext(AuthContext)

	const { loading, error, data } = useQuery(QUERY_TEACHERS, { variables: { department } })
	const [getTeachers, { loading: loadingTeachers, data: teachersList }] = useLazyQuery(
		QUERY_TEACHERS
	)
	const [getDepartments, { loading: loadingDepartments, data: departmentsList }] = useLazyQuery(
		QUERY_DEPARTMENTS
	)

	const [teachers, setTeachers] = useState([])
	const [selected, setSelected] = useState()

	useEffect(
		() => (teachersList ? setTeachers(teachersList.teachers) : setTeachers(data && data.teachers)),
		[data, teachersList]
	)

	if (loading) return <Loading />
	if (error) return <Error />

	document.title = `Teachers`

	return (
		<>
			<h1>Teachers</h1>
			<Divider />
			<Dropdown
				fluid
				search
				selection
				style={{ marginBottom: `0.75rem` }}
				onClick={getDepartments}
				loading={loadingDepartments}
				placeholder="Select a department to get list of teachers"
				options={
					departmentsList
						? departmentsList.departments.map(x => {
								return { text: x.name, value: x._id }
						  })
						: []
				}
				onChange={(_, { value }) => {
					setSelected(value)
					getTeachers({ variables: { department: value } })
				}}
			/>
			{teachers ? (
				teachers.length === 0 ? (
					<h3 className="highlight">There are no teachers in this department yet</h3>
				) : (
					<SingleTeacher
						theme={theme}
						access={access}
						history={history}
						teachers={teachers}
						loading={loadingTeachers}
					/>
				)
			) : (
				<h3 className="highlight">Please select a department first to get list of teachers</h3>
			)}
			<Button
				type="button"
				floated="right"
				onClick={() => history.push(`/addteacher`, { class: selected })}
				content="Add Teacher"
			/>
		</>
	)
}

export default Teachers
