import React from "react"
import { Link } from "react-router-dom"
import Constants from "../../../common/constants"
import { Segment, Table, Icon } from "semantic-ui-react"

const About = ({ data, history, theme }) => {
	const getDay = date => {
		const str = date.split(`-`)
		return Constants.months[Number(str[1]) - 1] + ` ` + str[2] + `, ` + +str[0]
	}

	return (
		<>
			<Segment inverted={theme} raised>
				<h3 style={{ display: `flex`, justifyContent: `space-between` }}>
					Personal Details
					<Icon onClick={() => history.push(`/updatestudent/` + data._id)} name="pen square" inverted={theme} />
				</h3>
				<Table inverted={theme} celled>
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
							<Table.Cell content="Registration Number" />
							<Table.Cell content={data.registrationNumber} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Enrollment Number" />
							<Table.Cell content={data.enrollmentNumber} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Contact Number" />
							<Table.Cell content={<a href={`tel:` + data.contactNumber}>{data.contactNumber}</a>} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Email Address" />
							<Table.Cell content={<a href={`mailto:` + data.email}>{data.email}</a>} />
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
							<Table.Cell content={data.dateOfBirth ? getDay(data.dateOfBirth) : null} />
						</Table.Row>
						<Table.Row>
							<Table.Cell colSpan="2" content="Current Address" icon="chevron down" />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Locality" />
							<Table.Cell content={data.address.current.locality} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Tehsil" />
							<Table.Cell content={data.address.current.tehsil} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="District" />
							<Table.Cell content={data.address.current.district} />
						</Table.Row>
						<Table.Row>
							<Table.Cell colSpan="2" content="Permanent Address" icon="chevron down" />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Locality" />
							<Table.Cell content={data.address.permanent.locality} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Tehsil" />
							<Table.Cell content={data.address.permanent.tehsil} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="District" />
							<Table.Cell content={data.address.permanent.district} />
						</Table.Row>
					</Table.Body>
				</Table>
			</Segment>
			<Segment inverted={theme} raised>
				<h3>Parent's Details</h3>
				<Table inverted={theme} celled>
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
							<Table.Cell content={<a href={`tel:` + data.father.contactNumber}>{data.father.contactNumber}</a>} />
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
							<Table.Cell content={<a href={`tel:` + data.mother.contactNumber}>{data.mother.contactNumber}</a>} />
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
				<Table inverted={theme} celled>
					<Table.Body>
						<Table.Row>
							<Table.Cell content="Registered on" />
							<Table.Cell content={new Date(data.createdAt).toDateString() + ` ` + new Date(data.createdAt).toLocaleTimeString()} />
						</Table.Row>
						<Table.Row>
							<Table.Cell content="Registered by" />
							<Table.Cell content={<Link to={`/teachers/` + data.createdBy}>{data.createdBy}</Link>} />
						</Table.Row>
						{data.updatedAt && (
							<>
								<Table.Row>
									<Table.Cell content="Last updated on" />
									<Table.Cell content={new Date(data.updatedAt).toDateString() + ` ` + new Date(data.updatedAt).toLocaleTimeString()} />
								</Table.Row>
								<Table.Row>
									<Table.Cell content="Last updated by" />
									<Table.Cell content={<Link to={`/teachers/` + data.updatedBy}>{data.updatedBy}</Link>} />
								</Table.Row>
							</>
						)}
					</Table.Body>
				</Table>
			</Segment>
		</>
	)
}

export default About
