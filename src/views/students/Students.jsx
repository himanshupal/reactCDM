import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import QUERY_COURSES from "../../queries/query/courses";
import QUERY_CLASSES from "../../queries/query/classes";
import QUERY_STUDENTS from "../../queries/query/students";
import React, { useState, useEffect, useContext } from "react";
import { Form, Segment, Divider, Table, Button } from "semantic-ui-react";
import { AuthContext } from "../../context/Auth";
import Notify from "../../common/Notify";
import { Link } from "react-router-dom";

const StudentsTable = ({ students }) => (
	<Table sortable celled striped color="red">
		<Table.Header>
			<Table.Row>
				<Table.HeaderCell>S. No.</Table.HeaderCell>
				<Table.HeaderCell>Roll No.</Table.HeaderCell>
				<Table.HeaderCell>Username</Table.HeaderCell>
				<Table.HeaderCell>First Name</Table.HeaderCell>
				<Table.HeaderCell>Last Name</Table.HeaderCell>
				<Table.HeaderCell>Contact</Table.HeaderCell>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{students.map((student, idx) => (
				<Table.Row key={idx} children="button">
					<Table.Cell>{idx + 1}</Table.Cell>
					<Table.Cell>{student.rollNumber ? student.rollNumber : `- - -`}</Table.Cell>
					<Table.Cell>
						<Link to={`/students/${student.username}`}>{student.username}</Link>
					</Table.Cell>
					<Table.Cell>{student.name.first}</Table.Cell>
					<Table.Cell>{student.name.last ? student.name.last : `- - -`}</Table.Cell>
					<Table.Cell>
						{student.contactNumber && <a href={`tel:${student.contactNumber}`}>{student.contactNumber}</a>}
						{student.email && (
							<>
								<br />
								<a href={`mailto:${student.email}`}>{student.email}</a>
							</>
						)}
						{!student.contactNumber && !student.email && `- - -`}
					</Table.Cell>
				</Table.Row>
			))}
		</Table.Body>
		<Table.Footer fullWidth>
			<Table.Row>
				<Table.HeaderCell colSpan="6" textAlign="right">
					<Button as={Link} to="/addstudent">
						Add Student
					</Button>
				</Table.HeaderCell>
			</Table.Row>
		</Table.Footer>
	</Table>
);

const Students = (props) => {
	const { user } = useContext(AuthContext);
	const privAccess = user && user.access === `Director`;
	const { loading: crsFetch, error: fetchErr, data } = useQuery(QUERY_COURSES);
	const [getClasses, { loading: loadingClasses, data: classList }] = useLazyQuery(QUERY_CLASSES);
	const [getStudents, { loading: loadingStudents, data: studentsList }] = useLazyQuery(QUERY_STUDENTS);
	const [courseArray, setCourseArray] = useState([]);
	const [studentsArray, setStudentsArray] = useState([]);

	useEffect(() => {
		if (sessionStorage.Students) {
			if (studentsList) {
				setStudentsArray(JSON.parse(sessionStorage.Students));
				sessionStorage.setItem(`Students`, JSON.stringify(studentsList.students));
			}
			setStudentsArray(JSON.parse(sessionStorage.Students));
		} else {
			if (studentsList) {
				sessionStorage.setItem(`Students`, JSON.stringify(studentsList.students));
				setStudentsArray(studentsList.students);
			}
		}
	}, [studentsList]);

	if (crsFetch) return <h2>Loading...</h2>;
	if (fetchErr) return <h2>{fetchErr.toString().split(`: `)[2]}</h2>;

	return (
		<Segment className={loadingStudents || loadingClasses ? `loading` : ``}>
			<h1>Students</h1>
			<Divider />
			<Form widths="equal">
				<Form.Group>
					{privAccess && (
						<Form.Select
							search
							name="department"
							label="Department"
							placeholder="Select a Department to get course list"
							options={data.departments.departments.map((x) => {
								return { text: x.name, value: x._id };
							})}
							onChange={(_, { value }) => setCourseArray(data.departments.departments.filter((x) => x._id === value)[0].courses)}
						/>
					)}
					<Form.Select
						search
						name="course"
						label="Course"
						placeholder="Select a Course to get list of Classes"
						options={
							privAccess
								? courseArray.map((x) => {
										return { text: x.name, value: x._id };
								  })
								: data.departments.departments[0].courses.map((y) => {
										return { text: y.name, value: y._id };
								  })
						}
						onChange={(_, { value }) => getClasses({ variables: { course: value } })}
					/>
					<Form.Select
						search
						name="class"
						label="Class"
						placeholder="Select a Class to get Student of"
						options={
							classList
								? classList.classes.map((x) => {
										return { key: x._id, text: x.name, value: x._id };
								  })
								: []
						}
						onChange={(_, { value }) => getStudents({ variables: { cid: value } })}
					/>
				</Form.Group>
			</Form>
			{studentsArray.length > 0 && <StudentsTable students={studentsArray} />}
			{studentsList && studentsList.students.length === 0 && <Notify list={[{ message: `Class doesn't have any students registered yet !` }]} />}
		</Segment>
	);
};

export default Students;
