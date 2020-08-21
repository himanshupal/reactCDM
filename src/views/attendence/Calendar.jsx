import CalendarTab from "react-calendar"
import React, { useState, useEffect } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import { Segment, Modal, Button, List } from "semantic-ui-react"
import QUERY_ATTENDENCE_MONTH from "../../queries/query/attendenceMonth"

const Calendar = ({ theme }) => {
	const [modal, showModal] = useState(false)
	const [onDate, setOnDate] = useState(new Date())
	const [attendence, setAttendence] = useState([])
	const { loading, error, data } = useQuery(QUERY_ATTENDENCE_MONTH)
	const [getAttendence, { loading: change, data: newData }] = useLazyQuery(QUERY_ATTENDENCE_MONTH)

	useEffect(() => {
		setAttendence(
			newData
				? newData.attendenceMonth.map(day => {
						return {
							...day,
							day: Number(day.day.slice(8)),
						}
				  })
				: data &&
						data.attendenceMonth.map(day => {
							return {
								...day,
								day: Number(day.day.slice(8)),
							}
						})
		)
	}, [data, newData])

	if (loading) return <h2>Loading...</h2>
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>

	return (
		<Segment className={change ? `loading` : ``} inverted={theme}>
			<CalendarTab
				className="react-calendar"
				calendarType="US"
				minDetail="year"
				maxDetail="month"
				showNeighboringMonth={false}
				minDate={new Date(1996, 0, 1)}
				maxDate={new Date()}
				tileDisabled={({ _, date }) => date.getDay() === 0}
				tileContent={({ date, view }) =>
					view === "month" && date.getDay() === 0 ? (
						<em>S</em>
					) : view === "month" && attendence && attendence.filter(_ => _.day === date.getDate() && _.holiday).length > 0 ? (
						<em>H</em>
					) : view === "month" && attendence && attendence.filter(_ => _.day === date.getDate()).length > 0 ? (
						<em>{attendence.filter(_ => _.day === date.getDate())[0].totalStudents}</em>
					) : (
						view === "month" &&
						date < new Date() && (
							<em>
								<small style={{ color: `#ddd` }}>NA</small>
							</em>
						)
					)
				}
				onActiveStartDateChange={({ activeStartDate, view }) =>
					view === `month` ? getAttendence({ variables: { month: activeStartDate.getMonth(), year: activeStartDate.getFullYear() } }) : null
				}
				onClickDay={date => {
					setOnDate(date)
					showModal(true)
				}}
				onClickMonth={date => getAttendence({ variables: { month: date.getMonth(), year: date.getFullYear() } })}
			/>
			<Modal size="tiny" open={modal}>
				<Modal.Header
					content={`Students present on ${new Date(onDate).toLocaleDateString("en-in", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}`}
				/>
				<Modal.Content
					content={
						attendence && attendence.filter(_ => _.day === onDate.getDate()).length === 0 ? (
							<List.Item content="Record Unavailable !" />
						) : attendence && attendence.filter(_ => _.day === onDate.getDate() && _.holiday).length > 0 ? (
							<List.Item content={attendence.filter(_ => _.day === onDate.getDate() && _.holiday)[0].holiday} />
						) : attendence && attendence.filter(_ => _.day === onDate.getDate() && !_.holiday && _.totalStudents === 0).length > 0 ? (
							<List.Item content="All students were absent !" />
						) : (
							attendence &&
							attendence.filter(_ => _.day === onDate.getDate() && !_.holiday).length > 0 && (
								<List as="ol" celled>
									{data.students.map((student, idx) => {
										if (attendence.filter(_ => _.day === onDate.getDate())[0].students.includes(student._id))
											return <List.Item as="li" key={idx} content={student.name.first + ` ` + student.name.last} />
										else return <List.Item as="li" style={{ color: `#ddd` }} key={idx} content={student.name.first + ` ` + student.name.last} />
									})}
								</List>
							)
						)
					}
				/>
				<Modal.Actions>
					<Button color="orange" onClick={() => showModal(false)} content="OKAY" />
				</Modal.Actions>
			</Modal>
		</Segment>
	)
}

export default Calendar
