import MUTATION_ADD_ATTENDENCE from "../../queries/mutation/addAttendence";
import { Segment, Table, Button, Input, Divider } from "semantic-ui-react";
import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import QUERY_STUDENTS from "../../queries/query/students";
import { AuthContext } from "../../context/Auth";
import Notify from "../../common/Notify";

const StudentsList = ({ students, present, setPresent, holiday }) =>
	students.map((student, idx) => (
		<Table.Row key={idx} children="button">
			<Table.Cell>{student.rollNumber ? student.rollNumber : `- - -`}</Table.Cell>
			<Table.Cell>{student.name.first}</Table.Cell>
			<Table.Cell>{student.name.last ? student.name.last : `- - -`}</Table.Cell>
			<Table.Cell>
				<Button
					as="p"
					fluid
					disabled={holiday}
					color={present.includes(student._id) ? `green` : `youtube`}
					onClick={() =>
						present.includes(student._id)
							? setPresent(present.filter((x) => x !== student._id))
							: setPresent([...present, student._id])
					}
				>
					{present.includes(student._id) ? `Yes` : `No`}
				</Button>
			</Table.Cell>
		</Table.Row>
	));

const Attendence = (props) => {
	const { user } = useContext(AuthContext);
	// const privAccess = user && user.access === `Director`;
	const { loading, error, data } = useQuery(QUERY_STUDENTS);
	const [notification, setNotification] = useState([]);
	const [variables, setVariables] = useState({});
	const [holiday, setHoliday] = useState(false);
	const [present, setPresent] = useState([]);
	const [addAttendence, { loading: saving }] = useMutation(MUTATION_ADD_ATTENDENCE, {
		update: (_, { data }) => {
			setNotification([...notification, { message: data.addAttendence }]);
		},
		onError: ({ graphQLErrors, networkError, message }) => {
			console.log(message);
			if (networkError) setNotification([...notification, { error: message.split(`: `)[1] }]);
			else setNotification([...notification, { message: message.split(`: `)[1], error: graphQLErrors[0].extensions.error }]);
		},
		variables,
	});

	useEffect(() => {
		data &&
			setVariables((variables) => {
				return {
					...variables,
					day: new Date().toISOString().slice(0, 10),
					class: data.students[0].class._id,
				};
			});
	}, [data]);
	useEffect(() => {
		setVariables((variables) => {
			return { ...variables, students: present };
		});
	}, [present]);

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>;

	return (
		<Segment className={saving ? `loading` : ``}>
			<h1>Attendence</h1>
			<Divider />
			{new Date().getDay() === 0 ? (
				setNotification([...notification, { message: `Today is Sunday.` }])
			) : (
				<>
					<Table attached="top" color="red">
						<Table.Body>
							<Table.Row textAlign="center">
								<Table.HeaderCell>Total Students: {data.students.length}</Table.HeaderCell>
								<Table.HeaderCell>Present Students: {present.length}</Table.HeaderCell>
							</Table.Row>
						</Table.Body>
					</Table>
					<Table attached="bottom" sortable compact celled striped>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Roll No.</Table.HeaderCell>
								<Table.HeaderCell>First Name</Table.HeaderCell>
								<Table.HeaderCell>Last Name</Table.HeaderCell>
								<Table.HeaderCell>Present</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<StudentsList students={data.students} present={present} setPresent={setPresent} holiday={holiday} />
						</Table.Body>
						<Table.Footer fullWidth>
							<Table.Row>
								<Table.HeaderCell colSpan="1">
									<Button
										fluid
										as="p"
										color="facebook"
										onClick={() => {
											setHoliday((holiday) => {
												holiday
													? delete variables.holiday
													: setVariables((variables) => {
															delete variables.students;
															return variables;
													  });
												return !holiday;
											});
										}}
									>
										Holiday
									</Button>
								</Table.HeaderCell>
								{holiday && (
									<Table.HeaderCell colSpan="2">
										<Input fluid label="Reason :" onChange={(_, { value }) => setVariables({ ...variables, holiday: value })} />
									</Table.HeaderCell>
								)}
								<Table.HeaderCell colSpan={holiday ? 1 : 3} textAlign="right">
									<Button disabled={!variables.holiday && !variables.students} as="p" onClick={() => addAttendence()}>
										Submit
									</Button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				</>
			)}
			{data && data.students.length === 0 ? (
				<Notify list={[{ message: `Class doesn't have any students registered yet !` }]} />
			) : (
				notification.length > 0 && <Notify list={notification} />
			)}
		</Segment>
	);
};

export default Attendence;
