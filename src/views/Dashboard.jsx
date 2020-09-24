import Clock from "react-clock"
import { blake2bHex } from "blakejs"
import { Segment, Input, Modal, Button, List } from "semantic-ui-react"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Calendar from "react-calendar"

const Home = ({ theme }) => {
	const [time, setTime] = useState(new Date())
	const [modal, setModal] = useState(false)
	const [hex, setHash] = useState(``)

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	const toggle = () => setModal(modal => !modal)

	document.title = `Dashboard`

	return (
		<Segment.Group>
			<Segment inverted={theme}>
				<Button
					fluid
					color="violet"
					type="button"
					animated="fade"
					inverted={theme}
					onClick={toggle}
					content={
						<>
							<Button.Content visible content="READ MORE ABOUT THIS" />
							<Button.Content hidden content="💬" />
						</>
					}
				/>
			</Segment>

			<Segment inverted={theme} style={{ display: `flex`, justifyContent: `center` }}>
				<Clock value={time} />
			</Segment>

			<Segment inverted={theme}>
				This is homepage which can be made public & customized to replace existing college site, if
				the authorities decide so. Currently it is showing some of components used within, but it
				will show various navlinks, statistics and updates as the project approach completion.
			</Segment>

			<Segment inverted={theme}>
				<Calendar
					className="react-calendar"
					calendarType="US"
					minDetail="year"
					maxDetail="month"
					showNeighboringMonth={false}
					minDate={new Date(1996, 0, 1)}
					maxDate={new Date()}
					tileDisabled={({ _, date }) => date.getDay() === 0}
				/>
			</Segment>

			<Segment inverted={theme}>
				<Input fluid inverted={theme} onChange={(_, { value }) => setHash(blake2bHex(value))} />
			</Segment>
			<Segment inverted={theme}>
				<Input fluid value={hex} inverted={theme} />
			</Segment>

			<Modal open={modal} onClose={toggle}>
				<Modal.Header content="College Data Manager" />
				<Modal.Content>
					<Modal.Description content="Objective is to create an official attendence webapp for the college which can be extended later on as needed. After inclusion of graph based weekly/monthly analysis of attendence it shall be no similar to traditional attendance management projects." />
					<List bulleted>
						<List.Item>
							<List.Header content="Authorization: There are five access levels" />
							<List.List as="ol">
								<List.Item as="li" content="Director" />
								<List.Item as="li" content="Head of Department" />
								<List.Item as="li" content="Associate Professor" />
								<List.Item as="li" content="Assistant Professor" />
								<List.Item as="li" content="Student" />
							</List.List>
						</List.Item>
						<List.Item header="Attendence can be taken on daily/monthly basis & updated on monthly basis." />
						<List.Item>
							<List.Header>
								CRUD operation on <Link to="/departments">Department</Link>,{" "}
								<Link to="/courses">Courses</Link>, <Link to="/classes">Classes & Subjects</Link> is
								already functional <em>(Access levels yet to configure)</em>
							</List.Header>
						</List.Item>
						<List.Item>
							<List.Header>
								<Link to="/newsession">Classes</Link> & <Link to="/addsubjects">Subjects</Link>{" "}
								`addition` page is also functional <em>(Access levels yet to configure)</em>
							</List.Header>
						</List.Item>
						<List.Item header="Once you select a duration for a course, the app automatically generates the class names based on course, session & if the course follows semester pattern; every detail of which is editable at the creation time & can also be change later if need arises" />
						<List.Item header="Multiple subjects [10] can be added in a single transaction & once added their is no need to update them every year. They will automatically sync with student's class." />
						<List.Item>
							<List.Header content="Students would be able to access a public notice board & their profile which consists of" />
							<List.List as="ol">
								<List.Item as="li" content="His/Her Attendence in graph form" />
								<List.Item as="li" content="Class Attendence in monthly calendar" />
								<List.Item
									as="li"
									content="Notes which can be shared at a maximum of Class Level"
								/>
								<List.Item as="li" content="Friends" />
							</List.List>
						</List.Item>
					</List>
				</Modal.Content>
				<Modal.Actions content={<Button onClick={toggle} color="youtube" content="O K A Y" />} />
			</Modal>
		</Segment.Group>
	)
}

export default Home
