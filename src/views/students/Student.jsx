import { Segment, Grid, Image, Divider, Button, Menu, Transition, Table, Icon } from "semantic-ui-react";
import QUERY_STUDENT from "../../queries/query/student";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Constants from "../common";
import src from "./logo512.png";

const getDay = (date) => {
	const str = date.split(`-`);
	return Constants.months[Number(str[1])] + ` ` + str[2] + `, ` + +str[0];
};

const About = ({ data, page, dark }) => {
	return (
		<>
			<Segment inverted={dark} raised>
				<h3 style={{ display: `flex`, justifyContent: `space-between` }}>
					Personal Details
					<Icon onClick={() => page.push(`/updatestudent/` + data._id)} name="pen square" inverted={dark} />
				</h3>
				<Table inverted={dark} celled>
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
							<Table.Cell content={data.dateOfBirth && getDay(data.dateOfBirth)} />
						</Table.Row>
					</Table.Body>
				</Table>
			</Segment>
			<Segment inverted={dark} raised>
				<h3>Parent's Details</h3>
				<Table inverted={dark} celled>
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
			<Segment inverted={dark} raised>
				<h3>Other Details</h3>
				<Table inverted={dark} celled>
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
	);
};

const Notes = ({ dark }) => <Segment inverted={dark}>{`notes`}</Segment>;
const Friends = ({ dark }) => <Segment inverted={dark}>{`friends`}</Segment>;

const Overview = ({ data, page, dark, setDark }) => {
	const [active, setActive] = useState(`0`);
	const changeActive = (_, { name }) => setActive(name);
	return (
		<>
			<Menu pointing secondary inverted={dark} stackable>
				<Menu.Item name="0" active={active === `0`} onClick={changeActive}>
					About
				</Menu.Item>
				<Menu.Item name="1" active={active === `1`} onClick={changeActive}>
					Notes
				</Menu.Item>
				<Menu.Item name="2" active={active === `2`} onClick={changeActive}>
					Friends
				</Menu.Item>
				<Menu.Menu position="right" content={<Menu.Item content={<Icon onClick={() => setDark((dark) => !dark)} name="sun" />} />} />
			</Menu>
			<Divider />
			<div style={{ maxHeight: `85vh` }}>
				<Segment.Group style={{ maxHeight: `inherit`, overflowY: active === `0` && `scroll` }}>
					{active === `0` ? (
						<About data={data} dark={dark} setDark={setDark} page={page} />
					) : active === `1` ? (
						<Notes data={data} dark={dark} />
					) : (
						<Friends data={data} dark={dark} />
					)}
				</Segment.Group>
			</div>
		</>
	);
};

const Attendence = ({ dark }) => (
	<Segment.Group>
		<Segment inverted={dark}>Seg 1</Segment>
		<Segment inverted={dark}>Seg 2</Segment>
		<Segment inverted={dark}>Seg 3</Segment>
	</Segment.Group>
);
const Performance = ({ dark }) => (
	<Segment.Group>
		<Segment inverted={dark}>Seg 3</Segment>
		<Segment inverted={dark}>Seg 2</Segment>
		<Segment inverted={dark}>Seg 1</Segment>
	</Segment.Group>
);

const Student = ({
	history,
	match: {
		params: { username },
	},
}) => {
	const [view, setView] = useState(`0`);
	const [dark, setDark] = useState(true);
	const { loading, error, data } = useQuery(QUERY_STUDENT, { variables: { sid: username } });

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>;

	const changeView = (_, { name }) => setView(name);
	return (
		<Segment inverted={dark} raised style={{ minHeight: `100%` }}>
			<Grid>
				<Grid.Row columns={2}>
					<Grid.Column width={5} style={{ paddingRight: `0.5rem` }} textAlign="center">
						<Segment inverted={dark} style={{ marginBottom: 0 }}>
							<h2 style={{ color: `blue` }}>{view === `0` ? `Overview` : view === `1` ? `Attendence` : `Performance`}</h2>
						</Segment>
						<Segment.Group>
							<Segment inverted={dark}>
								<Image src={src} size="small" centered circular bordered style={{ marginBottom: `1rem` }} />
								<h2 style={{ margin: 0 }}>{data.students[0].name.first + (` ` + data.students[0].name.last.toLowerCase() || ``)}</h2>
								<h5 style={{ marginTop: `0.5rem` }}>{data.students[0].class.name}</h5>
							</Segment>
							<Segment raised inverted={dark}>
								<Menu inverted={dark} fluid vertical pointing stackable>
									<Menu.Item name="0" active={view === `0`} onClick={changeView}>
										Overview
									</Menu.Item>
									<Menu.Item name="1" active={view === `1`} onClick={changeView}>
										Attendence
									</Menu.Item>
									<Menu.Item name="2" active={view === `2`} onClick={changeView}>
										Performance
									</Menu.Item>
								</Menu>
							</Segment>
							<Segment inverted={dark}>
								<Button fluid inverted={dark} color="youtube">
									Logout
								</Button>
							</Segment>
						</Segment.Group>
					</Grid.Column>
					<Grid.Column width={11} style={{ paddingLeft: `0.5rem` }}>
						<Transition animation="scale" duration={500}>
							{view === `0` ? (
								<Overview data={data.students[0]} page={history} dark={dark} setDark={setDark} />
							) : view === `1` ? (
								<Attendence />
							) : (
								<Performance />
							)}
						</Transition>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>
	);
};

export default Student;
