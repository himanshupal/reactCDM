import { Segment, Dropdown, Grid, Image, Table, Divider } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import QUERY_TEACHERS from "../../queries/query/teachers"
import QUERY_DPTS from "../../queries/query/dptOnly"
import { AuthContext } from "../../common/context"
import Constants from "../../common/constants"
import Notify from "../../common/Notify"
import { Link } from "react-router-dom"
import src from "../../common/ico.png"

const Teachers = () => {
	const getDay = date => {
		const str = date.split(`-`)
		return Constants.months[Number(str[1]) - 1] + ` ` + str[2] + `, ` + str[0]
	}

	const { user } = useContext(AuthContext)
	const privAccess = user && (user.access === `Director` || user.access === `Head of Department`)
	const [teachers, setTeachers] = useState([])
	const { loading: crsFetch, error: fetchErr, data } = useQuery(QUERY_DPTS)
	const [getTeachers, { loading: loadingTeachers, data: teachersList }] = useLazyQuery(QUERY_TEACHERS)

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

	useEffect(() => console.log(data && data.departments, teachersList), [data, teachersList])

	if (crsFetch) return <h2>Loading...</h2>
	if (fetchErr) return <h2>{fetchErr.toString().split(`: `)[2]}</h2>

	return (
		<Segment>
			<h1>Teachers</h1>
			<Divider />
			<Dropdown
				fluid
				search
				selection
				loading={loadingTeachers}
				placeholder="Select a department to get list of teachers"
				options={data.departments.departments.map(_ => {
					return { text: _.name, value: _._id }
				})}
				onChange={(_, { value }) => getTeachers({ variables: { department: value } })}
			/>
			{teachers.length > 0 && (
				<Segment.Group>
					{teachers.map((teacher, idx) => (
						<Segment key={idx}>
							<Grid divided>
								<Grid.Row columns={2}>
									<Grid.Column width={4} textAlign="center">
										<Image src={src} size="small" centered circular bordered style={{ marginBottom: `1rem` }} />
										<h2 style={{ margin: 0 }}>{teacher.name.first + (` ` + teacher.name.last.toLowerCase() || ``)}</h2>
									</Grid.Column>
									<Grid.Column width={12}>
										<div style={{ maxHeight: `14rem` }}>
											<Segment basic style={{ maxHeight: `inherit`, overflowY: `scroll`, padding: 0 }}>
												<Table celled>
													<Table.Body>
														<Table.Row>
															<Table.Cell content={<b>Username</b>} />
															<Table.Cell
																colSpan={2}
																content={privAccess ? <Link to={`/teacher/${teacher.username}`}>{teacher.username}</Link> : teacher.username}
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
															<Table.Cell content={teacher.dateOfBirth ? getDay(teacher.dateOfBirth) : null} />
															<Table.Cell content={<b>Contact</b>} />
															<Table.Cell content={<a href={`tel:${teacher.contactNumber}`}>{teacher.contactNumber}</a>} />
															<Table.Cell content={<b>E-Mail</b>} />
															<Table.Cell content={<a href={`mailto:${teacher.email}`}>{teacher.email}</a>} />
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
			{teachersList && teachersList.teachers.length === 0 && <Notify list={[{ message: `There are no teachers in this department yet !` }]} />}
		</Segment>
	)
}

export default Teachers
