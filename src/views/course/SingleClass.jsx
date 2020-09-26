import React from "react"
import { Segment, Divider, Form } from "semantic-ui-react"

const SingleClass = ({ loop, course, session, variables, setVariables, teachers, theme }) => {
	const onChange = (_, { name, value }) => setVariables({ ...variables, [name]: value })

	const suffix = [`st`, `nd`, `rd`, ...new Array(9).fill(`th`)]

	const date = new Date()
	const year = date.getFullYear()
	const today = date.toJSON().slice(0, 10)
	const monthAndDay = date.toJSON().slice(4, 10)
	const sessionEndMax = year + course.duration + monthAndDay
	const sessionEnd = year + 1 + monthAndDay

	let sem = loop + 1

	return (
		<Segment inverted={theme}>
			{loop === course.duration ? (
				<h4>Final Year (Course Finished)</h4>
			) : (
				<h4>
					{course.name} {loop + 1}
					<sup>{suffix[loop]}</sup>&nbsp;Year
					{course.semesterBased && (
						<>
							&nbsp;{session % 2 ? (sem *= 2) : loop * 2 + 1}
							<sup>{session % 2 ? suffix[--sem] : suffix[loop * 2]}</sup>
							&nbsp;Semester
						</>
					)}
				</h4>
			)}
			<Divider />
			<Form.Group>
				<Form.Input
					disabled={!session && loop === 0}
					required={
						course.semesterBased
							? session && loop === 0
								? loop === 0
								: loop !== 0
							: session && loop !== 0
							? loop === 0
							: loop !== 0
					}
					name={`name` + loop}
					placeholder="Previous name of the class"
					label="Current Name"
					value={variables[`name` + loop] || ``}
					onChange={onChange}
					onFocus={
						variables[`name` + loop]
							? null
							: ({ target: { name } }) => {
									const value = course.semesterBased
										? !session
											? loop === 0
												? `Class doesn't exist`
												: `${course.identifier} Year ${loop} Sem ${sem * 2 - 2}`
											: `${course.identifier} Year ${loop + 1} Sem ${sem}`
										: variables[`name` + loop]
										? variables[`name` + loop]
										: loop === 0
										? `Class doesn't exist`
										: `${course.identifier} Year ${loop}`
									setVariables({ ...variables, [name]: value })
							  }
					}
				/>
				<Form.Input
					required
					name={`newName` + loop}
					placeholder="New name of the class"
					label={loop === course.duration ? `Archive Name` : `New Name`}
					value={variables[`newName` + loop] || ``}
					onChange={onChange}
					onFocus={
						variables[`newName` + loop]
							? null
							: ({ target: { name } }) => {
									const value = course.semesterBased
										? session
											? `${course.identifier} Year ${loop + 1} Sem ${++sem}`
											: loop === course.duration
											? `${course.identifier} ${date.getFullYear() - course.duration}`
											: `${course.identifier} Year ${loop + 1} Sem ${loop * 2 + 1}`
										: loop === course.duration
										? `${course.identifier} ${date.getFullYear() - course.duration}`
										: `${course.identifier} Year ${loop + 1}`
									setVariables({ ...variables, [name]: value })
							  }
					}
				/>
				{loop !== course.duration && (
					<Form.Select
						options={teachers}
						onChange={onChange}
						placeholder="Select a teacher"
						name={`classTeacher` + loop}
						label="Class Teacher"
						value={variables[`classTeacher` + loop] ? variables[`classTeacher` + loop] : ``}
					/>
				)}
			</Form.Group>
			{loop !== course.duration && (
				<Form.Group>
					<Form.Input
						type="date"
						min="1996-01-01"
						max={sessionEndMax}
						onChange={onChange}
						name={`sessionStart` + loop}
						label="Session Start date"
						value={variables[`sessionStart` + loop] ? variables[`sessionStart` + loop] : ``}
						onFocus={
							variables[`sessionStart` + loop]
								? null
								: ({ target: { name } }) => setVariables({ ...variables, [name]: today })
						}
					/>
					<Form.Input
						type="date"
						min="1996-07-01"
						max={sessionEndMax}
						onChange={onChange}
						name={`sessionEnd` + loop}
						label="Session End date"
						value={variables[`sessionEnd` + loop] ? variables[`sessionEnd` + loop] : ``}
						onFocus={
							variables[`sessionEnd` + loop]
								? null
								: ({ target: { name } }) => setVariables({ ...variables, [name]: sessionEnd })
						}
					/>
				</Form.Group>
			)}
		</Segment>
	)
}

export default SingleClass
