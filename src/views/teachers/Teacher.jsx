import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { Button, Image, Modal, Table, Segment } from "semantic-ui-react"

import QUERY_TEACHER from "../../queries/query/teacher"

import { getName, getDate } from "../shared/helpers"
import src from "../../common/ico.png"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

const Teacher = ({
	match: {
		params: { username },
	},
	theme,
	history,
}) => {
	const { loading, error, data } = useQuery(QUERY_TEACHER, { variables: { username } })

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<Modal open onClose={() => history.goBack()}>
			<Modal.Content
				content={
					<Segment
						textAlign="center"
						inverted={theme}
						content={
							<>
								<Image src={src} size="small" centered circular style={{ marginBottom: `1rem` }} />
								<h2>{getName(data.teacher.name)}</h2>
								<div className="table_overflow">
									<Table celled unstackable striped singleLine inverted={theme}>
										<Table.Body>
											<Table.Row>
												<Table.Cell content={<b>Username</b>} />
												<Table.Cell colSpan={2} content={data.teacher.username} />
												<Table.Cell content={<b>Registration Number</b>} />
												<Table.Cell colSpan={2} content={data.teacher.registrationNumber} />
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Class Teacher of</b>} />
												<Table.Cell colSpan={2} content={data.teacher.classTeacherOf.name} />
												<Table.Cell content={<b>Designation</b>} />
												<Table.Cell colSpan={2} content={data.teacher.designation} />
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Gender</b>} />
												<Table.Cell content={data.teacher.gender} />
												<Table.Cell content={<b>Caste</b>} />
												<Table.Cell content={data.teacher.caste} />
												<Table.Cell content={<b>Religion</b>} />
												<Table.Cell content={data.teacher.religion} />
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Date of Birth</b>} />
												<Table.Cell colSpan={2} content={getDate(data.teacher.dateOfBirth)} />
												<Table.Cell content={<b>Blood Group</b>} />
												<Table.Cell colSpan={2} content={data.teacher.bloodGroup} />
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Contact</b>} />
												<Table.Cell
													selectable
													content={
														<a href={`tel:${data.teacher.contactNumber}`}>
															{data.teacher.contactNumber}
														</a>
													}
												/>
												<Table.Cell content={<b>Alt. Contact</b>} />
												<Table.Cell
													selectable
													content={
														<a href={`tel:${data.teacher.alternativeContact}`}>
															{data.teacher.alternativeContact}
														</a>
													}
												/>
												<Table.Cell content={<b>E-Mail</b>} />
												<Table.Cell
													selectable
													content={
														<a href={`mailto:${data.teacher.email}`}>{data.teacher.email}</a>
													}
												/>
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Joining Date</b>} />
												<Table.Cell colSpan={2} content={data.teacher.dateOfJoining} />
												<Table.Cell content={<b>Leaving Date</b>} />
												<Table.Cell colSpan={2} content={data.teacher.dateOfLeaving} />
											</Table.Row>
											<Table.Row>
												<Table.Cell content={<b>Current Address</b>} />
												<Table.Cell
													colSpan={5}
													content={
														data.teacher.address.current &&
														data.teacher.address.current.locality +
															`, ` +
															data.teacher.address.current.tehsil +
															`, ` +
															data.teacher.address.current.district
													}
												/>
											</Table.Row>
											{data.teacher.address.permanent && (
												<Table.Row>
													<Table.Cell content={<b>Permanent Address</b>} />
													<Table.Cell
														colSpan={5}
														content={
															data.teacher.address.permanent.locality +
															`, ` +
															data.teacher.address.permanent.tehsil +
															`, ` +
															data.teacher.address.permanent.district
														}
													/>
												</Table.Row>
											)}
											<Table.Row>
												<Table.Cell colSpan={6} content="Teaches" icon="chevron down" />
											</Table.Row>
											{data.teacher.teaches.map((subject, idx) => (
												<Table.Row key={idx}>
													<Table.Cell content={<b>Subject</b>} />
													<Table.Cell colSpan={2} content={subject.name} />
													<Table.Cell content={<b>Class</b>} />
													<Table.Cell colSpan={2} content={subject.class} />
												</Table.Row>
											))}
										</Table.Body>
									</Table>
								</div>
							</>
						}
					/>
				}
			/>
			<Modal.Actions>
				<Button content="All Teachers" onClick={() => history.push(`/teachers`)} />
			</Modal.Actions>
		</Modal>
	)
}

export default Teacher
