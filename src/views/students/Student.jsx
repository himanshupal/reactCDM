import { Segment, Grid, Image, Button, Menu, Transition, Icon } from "semantic-ui-react";
import QUERY_STUDENT from "../../queries/query/student";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import QUERY_NOTES from "../../queries/query/notes";
import Calendar from "../attendence/Calendar";
import React, { useState } from "react";
import Notices from "./student/Notices";
import About from "./student/About";
import Notes from "./student/Notes";
import src from "./logo512.png";

const Friends = ({ dark }) => <Segment inverted={dark}>{`friends`}</Segment>;

const Overview = ({ data, history, dark, setDark, notes, getNotes, loading }) => {
	const [active, setActive] = useState(`0`);
	const [newNote, createNewNote] = useState(false);
	const changeActive = (_, { name }) => setActive(name);
	return (
		<>
			<Menu pointing secondary inverted={dark} stackable>
				<Menu.Item name="0" active={active === `0`} onClick={changeActive} content="About" />
				<Menu.Item
					name="1"
					active={active === `1`}
					onClick={(_, e) => {
						changeActive(_, e);
						getNotes();
					}}
					content="Notes"
				/>
				<Menu.Item name="2" active={active === `2`} onClick={changeActive} content="Notices" />
				<Menu.Item name="3" active={active === `3`} onClick={changeActive} content="Friends" />
				<Menu.Menu
					position="right"
					content={
						<Menu.Item
							content={
								<>
									{active === `1` && <Icon onClick={() => createNewNote((newNote) => !newNote)} name="plus" />}
									<Icon onClick={() => setDark((dark) => !dark)} name="sun" />
								</>
							}
						/>
					}
				/>
			</Menu>
			<div style={{ maxHeight: `85vh` }}>
				<Segment.Group style={{ maxHeight: `inherit`, overflowY: `scroll` }}>
					{active === `0` ? (
						<About data={data} dark={dark} setDark={setDark} history={history} />
					) : active === `1` ? (
						<Notes dark={dark} data={notes} loading={loading} note={newNote} />
					) : active === `2` ? (
						<Notices data={data} />
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
		<Calendar />
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
	const [getNotes, { loading: loadingNotes, data: notes }] = useLazyQuery(QUERY_NOTES);

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>;

	const changeView = (_, { name }) => setView(name);
	return (
		<Segment inverted={dark} raised style={{ minHeight: `100%` }}>
			<Grid>
				<Grid.Row columns={2}>
					<Grid.Column width={6} style={{ paddingRight: `0.5rem` }} textAlign="center">
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
									<Menu.Item name="0" active={view === `0`} onClick={changeView} content="Overview" />
									<Menu.Item name="1" active={view === `1`} onClick={changeView} content="Attendence" />
									<Menu.Item name="2" active={view === `2`} onClick={changeView} content="Performance" />
								</Menu>
							</Segment>
							<Segment inverted={dark}>
								<Button fluid inverted={dark} color="youtube" content="Logout" />
							</Segment>
						</Segment.Group>
					</Grid.Column>
					<Grid.Column width={10} style={{ paddingLeft: `0.5rem` }}>
						<Transition animation="scale" duration={500}>
							{view === `0` ? (
								<Overview
									data={data.students[0]}
									history={history}
									dark={dark}
									notes={notes}
									setDark={setDark}
									getNotes={getNotes}
									loading={loadingNotes}
								/>
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
