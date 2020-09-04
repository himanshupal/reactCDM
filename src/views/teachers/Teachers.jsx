import { Segment, Dropdown, Grid, Image, Table, Divider } from "semantic-ui-react"
import React, { useState, useEffect } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
// import { AuthContext } from "../../common/context"
import { Link } from "react-router-dom"

import QUERY_TEACHERS from "../../queries/query/teachers"
import QUERY_DEPARTMENTS from "../../queries/query/listOfDepartments"

import src from "../../common/ico.png"
import { getDate } from "../shared/helpers"
import Loading from "../shared/Loading"
import Error from "../shared/Error"

const Teachers = ({ theme }) => {
	// const {
	// 	user: { access, department },
	// } = useContext(AuthContext)

	const { loading, error, data } = useQuery(QUERY_DEPARTMENTS)
	const [getTeachers, { loading: loadingTeachers, data: teachersList }] = useLazyQuery(
		QUERY_TEACHERS
	)

	const [teachers, setTeachers] = useState([])

	useEffect(() => {
		if (sessionStorage.Teachers) {
			if (teachersList) {
				setTeachers(JSON.parse(sessionStorage.Teachers))
				sessionStorage.setItem(`Teachers`, JSON.stringify(teachersList.teachers))
			}
			setTeachers(JSON.parse(sessionStorage.Teachers))
		} else {
			if (teachersList) {
				sessionStorage.setItem(`Teachers`, JSON.stringify(teachersList.teachers))
				setTeachers(teachersList.teachers)
			}
		}
	}, [teachersList])

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<>
			<h1>Teachers</h1>
			<Divider />
			<Dropdown
				fluid
				search
				selection
				loading={loadingTeachers}
				placeholder="Select a department to get list of teachers"
				options={data.departments.map(x => {
					return { text: x.name, value: x._id }
				})}
				onChange={(_, { value }) => getTeachers({ variables: { department: value } })}
			/>
			{teachers.length > 0 && (
				<Segment.Group>
					{teachers.map((teacher, idx) => (
						<Segment key={idx} inverted={theme}>
							<Grid divided>
								<Grid.Row columns={2}>
									<Grid.Column width={4} textAlign="center">
										<Image
											src={src}
											size="small"
											centered
											circular
											bordered
											style={{ marginBottom: `1rem` }}
										/>
										<h2 style={{ margin: 0 }}>
											{teacher.name.first + (` ` + teacher.name.last.toLowerCase() || ``)}
										</h2>
									</Grid.Column>
									<Grid.Column width={12}>
										<div style={{ maxHeight: `14rem` }}>
											<Segment
												basic
												inverted={theme}
												style={{ maxHeight: `inherit`, overflowY: `scroll`, padding: 0 }}
											>
												<Table celled inverted={theme}>
													<Table.Body>
														<Table.Row>
															<Table.Cell content={<b>Username</b>} />
															<Table.Cell
																colSpan={2}
																content={
																	<Link to={`/teacher/` + teacher.username}>
																		{teacher.username}
																	</Link>
																}
															/>
															<Table.Cell content={<b>Designation</b>} />
															<Table.Cell colSpan={2} content={teacher.designation} />
														</Table.Row>
														<Table.Row>
															<Table.Cell content={<b>Class teacher of</b>} />
															<Table.Cell colSpan={5} content={teacher.classTeacherOf.name} />
														</Table.Row>
														<Table.Row>
															<Table.Cell content={<b>Gender</b>} />
															<Table.Cell content={teacher.gender} />
															<Table.Cell content={<b>Caste</b>} />
															<Table.Cell content={teacher.caste} />
															<Table.Cell content={<b>Religion</b>} />
															<Table.Cell content={teacher.religion} />
														</Table.Row>
														<Table.Row>
															<Table.Cell content={<b>Date of Birth</b>} />
															<Table.Cell
																content={teacher.dateOfBirth ? getDate(teacher.dateOfBirth) : null}
															/>
															<Table.Cell content={<b>Contact</b>} />
															<Table.Cell
																content={
																	<a href={`tel:${teacher.contactNumber}`}>
																		{teacher.contactNumber}
																	</a>
																}
															/>
															<Table.Cell content={<b>E-Mail</b>} />
															<Table.Cell
																content={<a href={`mailto:${teacher.email}`}>{teacher.email}</a>}
															/>
														</Table.Row>
														<Table.Row>
															<Table.Cell colSpan={6} content="Teaches" icon="chevron down" />
														</Table.Row>
													</Table.Body>
												</Table>
											</Segment>
										</div>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					))}
				</Segment.Group>
			)}
		</>
	)
}

export default Teachers
