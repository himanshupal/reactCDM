import { Segment, Divider, Button, Grid, Image } from "semantic-ui-react";
import QUERY_STUDENT from "../../queries/query/student";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import src from "./logo512.png";
import Constants from "../common";
import React from "react";
// import Notify from "../../common/Notify";

const getDay = (date) => {
	const str = date.split(`-`);
	return str[2] + ` ` + Constants.months[Number(str[1])] + ` ` + str[0];
};

const Student = ({
	match: {
		params: { username },
	},
	history,
}) => {
	const { loading, error, data } = useQuery(QUERY_STUDENT, { variables: { sid: username } });
	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>;

	// aadharNumber: "1111 2222 3333"
	// address: {current: {…}, permanent: {…}, __typename: "Address"}
	// bloodGroup: "AB+"
	// caste: "OBC"
	// class: {name: "MCA Year 1 Sem 2", __typename: "Class"}
	// contactNumber: "902-767-3580"
	// createdAt: 1595148414188
	// dateOfBirth: "1975-06-01"
	// email: "spal2070@gmail.com"
	// enrollmentNumber: null
	// father: {name: "Ghasi Ram Pal", occupation: "Ex. Serviceman", annualSalary: 38000, contactNumber: "902-767-3580", __typename: "Parent"}
	// gender: "Female"
	// mother: {name: "Mohini Devi", occupation: "Housewife", annualSalary: null, contactNumber: null, __typename: "Parent"}
	// name: {first: "Sunita", last: "Pal", __typename: "Name"}
	// registrationNumber: "July14"
	// religion: "Hinduism"
	// rollNumber: null
	// updatedAt: null
	// username: "sunitapal"
	// __typename: "Student"
	// _id: "5f14087e88525a3b70072149"

	return (
		<>
			<Segment attached="top">
				<h1>{data.students[0].name.first + ` ` + data.students[0].name.last + `, student of ` + data.students[0].class.name + `.`}</h1>
				<Divider />
				<Image src={src} width="150px" centered />
				<Grid>
					<Grid.Row>
						<Grid.Column width={2} />
						<Grid.Column width={12}>
							<Grid.Row>
								<b>Roll Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].rollNumber ? data.students[0].rollNumber : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Enrollment Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].enrollmentNumber ? data.students[0].enrollmentNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Gender:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].gender ? data.students[0].gender : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Religion:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].religion ? data.students[0].religion : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Caste:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].caste ? data.students[0].caste : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Aadhar Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].aadharNumber ? data.students[0].aadharNumber : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Blood Group:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].bloodGroup ? data.students[0].bloodGroup : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Date of Birth:</b>
								&nbsp;
								<span style={{ color: `#555` }}>{data.students[0].dateOfBirth ? getDay(data.students[0].dateOfBirth) : `- - -`}</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
							<Grid.Row>
								<b>Registration Number:</b>
								&nbsp;
								<span style={{ color: `#555` }}>
									{data.students[0].registrationNumber ? data.students[0].registrationNumber : `- - -`}
								</span>
							</Grid.Row>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
			<Button attached="bottom" as={Link} to={`/updatestudent/` + data.students[0]._id}>
				Update
			</Button>
		</>
	);
};

export default Student;
