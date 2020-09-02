import { Segment, Grid, Image, Button, Menu, Icon } from "semantic-ui-react"
import QUERY_STUDENT from "../../queries/query/student"
import Performance from "./student/Performance"
import { useQuery } from "@apollo/react-hooks"
import Attendence from "../shared/Attendence"
import React, { useState } from "react"
import src from "../../common/ico.png"
import About from "./student/About"
import Notes from "../shared/Notes"
import Notices from "../Notices"

const Friends = ({ theme }) => <Segment inverted={theme}>{`friends`}</Segment>

const Overview = ({ history, theme, data, tab, par, username }) => {
	const [newNote, createNewNote] = useState(false)
	const changeActive = (_, { name }) =>
		history.push(`/students/` + username + `/` + par + `/` + name)
	return (
		<>
			<Menu pointing secondary inverted={theme} stackable>
				<Menu.Item name="about" active={tab === `about`} onClick={changeActive} content="About" />
				<Menu.Item name="notes" active={tab === `notes`} onClick={changeActive} content="Notes" />
				<Menu.Item
					name="friends"
					active={tab === `friends`}
					onClick={changeActive}
					content="Friends"
				/>
				<Menu.Menu
					position="right"
					content={
						<Menu.Item
							content={
								tab === `notes` && (
									<Icon onClick={() => createNewNote(newNote => !newNote)} name="plus" />
								)
							}
						/>
					}
				/>
			</Menu>
			<div style={{ maxHeight: 523 }}>
				<Segment.Group style={{ maxHeight: `inherit`, overflowY: `scroll` }}>
					{tab === `about` ? (
						<About theme={theme} username={username} data={data} />
					) : tab === `notes` ? (
						<Notes theme={theme} username={username} newNote={newNote} />
					) : tab === `friends` ? (
						<Friends theme={theme} username={username} />
					) : (
						`Select a Tab`
					)}
				</Segment.Group>
			</div>
		</>
	)
}

const Student = ({
	theme,
	history,
	match: {
		params: { username, tab, item },
	},
}) => {
	const { loading, error, data } = useQuery(QUERY_STUDENT, { variables: { sid: username } })

	if (loading) return <h2>Loading...</h2>
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>

	const changeView = (_, { name }) => history.push(`/students/` + username + `/` + name)

	return (
		<Segment inverted={theme} raised style={{ minHeight: `100%` }}>
			<Grid>
				<Grid.Row columns={2}>
					<Grid.Column width={5} style={{ paddingRight: `0.5rem` }} textAlign="center">
						<Segment inverted={theme} style={{ marginBottom: 0 }}>
							<h2 style={{ color: `blue` }}>
								{tab === `notices`
									? `Notices`
									: tab === `personal`
									? `Personal`
									: tab === `attendence`
									? `Attendence`
									: tab === `performance`
									? `Performance`
									: ``}
							</h2>
						</Segment>
						<Segment.Group>
							<Segment inverted={theme}>
								<Image
									src={src}
									size="small"
									centered
									circular
									bordered
									style={{ marginBottom: `1rem` }}
								/>
								<h2 style={{ margin: 0 }}>
									{data.students[0].name.first +
										(` ` + data.students[0].name.last.toLowerCase() || ``)}
								</h2>
								<h5 style={{ marginTop: `0.5rem` }}>{data.students[0].class.name}</h5>
							</Segment>
							<Segment raised inverted={theme}>
								<Menu inverted={theme} fluid vertical pointing stackable>
									<Menu.Item
										name="notices"
										active={tab === `notices`}
										onClick={changeView}
										content="Notices"
									/>
									<Menu.Item
										name="personal"
										active={tab === `personal`}
										onClick={changeView}
										content="Personal"
									/>
									<Menu.Item
										name="attendence"
										active={tab === `attendence`}
										onClick={changeView}
										content="Attendence"
									/>
									<Menu.Item
										name="performance"
										active={tab === `performance`}
										onClick={changeView}
										content="Performance"
									/>
								</Menu>
							</Segment>
							<Segment inverted={theme}>
								<Button fluid inverted={theme} color="youtube" content="Logout" />
							</Segment>
						</Segment.Group>
					</Grid.Column>
					<Grid.Column width={11} style={{ paddingLeft: `0.5rem` }}>
						{tab === `notices` ? (
							<Notices theme={theme} />
						) : tab === `personal` ? (
							<Overview
								data={data.students[0]}
								history={history}
								theme={theme}
								tab={item}
								par={tab}
								username={username}
							/>
						) : tab === `attendence` ? (
							<Attendence theme={theme} />
						) : tab === `performance` ? (
							<Performance theme={theme} />
						) : (
							`Select a Tab`
						)}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>
	)
}

export default Student
