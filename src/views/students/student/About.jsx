import React from "react"
import { Link } from "react-router-dom"
import { Segment, Table, Icon } from "semantic-ui-react"
import { getDate, getName, getTime } from "../../shared/helpers"

const About = ({ data, history, access, theme }) => (
	<>
		<Segment inverted={theme} raised>
			<h3 style={{ display: `flex`, justifyContent: `space-between` }}>
				Personal Details
				{access !== `Student` && (
					<Icon
						onClick={() => history.push(`/student/` + data.username + `/update`)}
						name="edit"
						inverted={theme}
						style={{ cursor: `pointer` }}
					/>
				)}
			</h3>

			<Table inverted={theme} celled unstackable singleLine>
				<Table.Body>
					<Table.Row>
						<Table.Cell content="Username" />
						<Table.Cell content={data.username} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Roll Number" />
						<Table.Cell content={data.rollNumber} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Name" />
						<Table.Cell content={getName(data.name)} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Registration Number" />
						<Table.Cell content={data.registrationNumber} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Enrollment Number" />
						<Table.Cell content={data.enrollmentNumber} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Contact Number" />
						<Table.Cell
							selectable
							content={<a href={`tel:` + data.contactNumber}>{data.contactNumber}</a>}
						/>
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Email Address" />
						<Table.Cell selectable content={<a href={`mailto:` + data.email}>{data.email}</a>} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Gender" />
						<Table.Cell content={data.gender} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Caste" />
						<Table.Cell content={data.caste} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Religion" />
						<Table.Cell content={data.religion} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Blood Group" />
						<Table.Cell content={data.bloodGroup} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Date of Birth" />
						<Table.Cell content={getDate(data.dateOfBirth)} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Current Address" />
						<Table.Cell
							content={
								data.address.current.locality +
								`, ` +
								data.address.current.tehsil +
								`, ` +
								data.address.current.district
							}
						/>
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Permanent Address" />
						<Table.Cell
							content={
								data.address.permanent.locality +
								`, ` +
								data.address.permanent.tehsil +
								`, ` +
								data.address.permanent.district
							}
						/>
					</Table.Row>
				</Table.Body>
			</Table>
		</Segment>

		<Segment inverted={theme} raised>
			<h3>Parent's Details</h3>
			<Table inverted={theme} celled unstackable>
				<Table.Body>
					<Table.Row>
						<Table.Cell colSpan="2" content="Father" icon="chevron down" />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Name" />
						<Table.Cell content={data.father.name} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Contact Number" />
						<Table.Cell
							selectable
							content={<a href={`tel:` + data.father.contactNumber}>{data.father.contactNumber}</a>}
						/>
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Occupation" />
						<Table.Cell content={data.father.occupation} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Annual Salary" />
						<Table.Cell content={data.father.annualSalary} />
					</Table.Row>
					<Table.Row>
						<Table.Cell colSpan="2" content="Mother" icon="chevron down" />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Name" />
						<Table.Cell content={data.mother.name} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Contact Number" />
						<Table.Cell
							selectable
							content={<a href={`tel:` + data.mother.contactNumber}>{data.mother.contactNumber}</a>}
						/>
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Occupation" />
						<Table.Cell content={data.mother.occupation} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Annual Salary" />
						<Table.Cell content={data.mother.annualSalary} />
					</Table.Row>
				</Table.Body>
			</Table>
		</Segment>

		<Segment inverted={theme} raised>
			<h3>Other Details</h3>
			<Table inverted={theme} celled unstackable>
				<Table.Body>
					<Table.Row>
						<Table.Cell content="Registered on" />
						<Table.Cell content={getTime(data.createdAt)} />
					</Table.Row>
					<Table.Row>
						<Table.Cell content="Registered by" />
						<Table.Cell
							selectable={access !== `Student`}
							content={
								access === `Student` ? (
									getName(data.createdBy.name)
								) : (
									<Link to={`/teacher/` + data.createdBy.username}>
										{getName(data.createdBy.name)}
									</Link>
								)
							}
						/>
					</Table.Row>
					{data.updatedAt && (
						<>
							<Table.Row>
								<Table.Cell content="Last updated on" />
								<Table.Cell
									content={
										new Date(data.updatedAt).toDateString() +
										` ` +
										new Date(data.updatedAt).toLocaleTimeString()
									}
								/>
							</Table.Row>
							<Table.Row>
								<Table.Cell content="Last updated by" />
								<Table.Cell
									selectable={access !== `Student`}
									content={
										access === `Student` ? (
											getName(data.updatedBy.name)
										) : (
											<Link to={`/teacher/` + data.updatedBy.username}>
												{getName(data.updatedBy.name)}
											</Link>
										)
									}
								/>
							</Table.Row>
						</>
					)}
				</Table.Body>
			</Table>
		</Segment>
	</>
)

export default About
