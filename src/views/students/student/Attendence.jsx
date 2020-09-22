import CalendarTab from "react-calendar"
import React, { useState, useEffect } from "react"
import { useQuery, useLazyQuery } from "@apollo/react-hooks"
import { Modal, List, Dimmer, Dropdown, Menu } from "semantic-ui-react"

import ATTENDENCE_MONTH from "../../../queries/query/attendence"

import Loading from "../../shared/Loading"
import Error from "../../shared/Error"

import { getDate, getName, getSundays } from "../../shared/helpers"
import { generate } from "c3"

const Attendence = ({ theme, history }) => {
	const [modal, showModal] = useState(false)
	const [students, setStudents] = useState(0)
	const [onDate, setOnDate] = useState(new Date())
	const [attendence, setAttendence] = useState([])

	const [range, setRange] = useState({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})

	const [daysInMonth, setDaysInMonth] = useState(30)

	const { loading, error, data } = useQuery(ATTENDENCE_MONTH)
	const [getAttendence, { loading: change, data: newData }] = useLazyQuery(ATTENDENCE_MONTH)

	useEffect(() => setDaysInMonth(new Date(range.year, range.month + 1, 0).getDate()), [range])

	useEffect(() => {
		if (newData) {
			setStudents(Number(newData.students.length))
			setAttendence(
				newData.attendence.map(each => {
					return {
						...each,
						day: Number(each.day.split(/\//)[0]),
					}
				})
			)
		} else if (data) {
			setStudents(Number(data.students.length))
			setAttendence(
				data.attendence.map(each => {
					return {
						...each,
						day: Number(each.day.split(/\//)[0]),
					}
				})
			)
		}
	}, [data, newData])

	const chart = generate({
		bindto: `#chart`,
		data: {
			x: `x`,
			columns: [[`x`, ...new Array(daysInMonth).fill(1).map((x, idx) => x + idx)], [`Present`]],
			type: `spline`,
		},
		// axis: {
		// 	y: {
		// 		min: -students,
		// 		max: students,
		// 	},
		// },
		subchart: {
			show: true,
		},
		zoom: {
			enabled: true,
		},
		tooltip: {
			format: {
				title: d => d && getDate(`${range.month + 1}-${d}-${range.year}`),
			},
		},
	})

	useEffect(() => {
		const present = new Array(daysInMonth)
			.fill(0)
			.map((x, idx) =>
				attendence && attendence.map(x => x.day).includes(idx + 1)
					? attendence.map(x => x.day === idx + 1 && x.totalStudents).filter(x => x !== false)[0]
					: x
			)
		const absent = new Array(daysInMonth)
			.fill(0)
			.map((x, idx) =>
				attendence && attendence.map(x => x.day).includes(idx + 1)
					? attendence
							.map(x => x.day === idx + 1 && students - x.totalStudents)
							.filter(x => x !== false)[0]
					: x
			)

		chart.xgrids([
			...getSundays(range.month, range.year).map(x => {
				return { text: `Sunday`, value: x + 1 }
			}),
			...new Array(daysInMonth)
				.fill(0)
				.map((x, idx) =>
					attendence && attendence.map(x => x.day).includes(idx + 1)
						? attendence
								.map(x => x.day === idx + 1 && x.holiday && { text: x.holiday, value: idx + 1 })
								.filter(x => x || undefined)[0]
						: x
				)
				.filter(x => typeof x === `object`),
		])
		chart.load({
			columns: [
				[`Present`, ...present],
				[`Absent`, ...absent],
			],
		})
		return () => null
	}, [data, chart, range, students, newData, attendence, daysInMonth])

	const chartTypes = [
		{ text: `Line`, value: `line` },
		{ text: `Spline`, value: `spline` },
		{ text: `Area`, value: `area` },
		{ text: `Area Step`, value: `area-step` },
		{ text: `Area Spline`, value: `area-spline` },
		{ text: `Bar`, value: `bar` },
		{ text: `Pie`, value: `pie` },
		{ text: `Donut`, value: `donut` },
		{ text: `Scatter`, value: `scatter` },
	]

	if (loading) return <Loading />
	if (error) return <Error />

	return (
		<>
			<Dimmer active={change} inverted={!theme} />
			<CalendarTab
				className={`react-calendar ${theme && `calendar-dark`}`}
				calendarType="US"
				minDetail="year"
				maxDetail="month"
				showNeighboringMonth={false}
				minDate={new Date(1996, 0, 1)}
				maxDate={new Date()}
				tileDisabled={({ _, date, view }) => view === `month` && date.getDay() === 0}
				tileContent={({ date, view }) =>
					view === `month` && date.getDay() === 0 ? (
						<em>S</em>
					) : view === `month` &&
					  attendence &&
					  attendence.filter(_ => _.day === date.getDate() && _.holiday).length > 0 ? (
						<em>H</em>
					) : view === `month` &&
					  attendence &&
					  attendence.filter(_ => _.day === date.getDate()).length > 0 ? (
						<em>{attendence.filter(_ => _.day === date.getDate())[0].totalStudents}</em>
					) : (
						view === `month` &&
						date < new Date() && (
							<em>
								<small style={{ color: `#ddd` }}>NA</small>
							</em>
						)
					)
				}
				onActiveStartDateChange={({ activeStartDate, view }) => {
					setRange({
						month: activeStartDate.getMonth(),
						year: activeStartDate.getFullYear(),
					})
					return (
						view === `month` &&
						getAttendence({
							variables: {
								month: activeStartDate.getMonth(),
								year: activeStartDate.getFullYear(),
							},
						})
					)
				}}
				onClickDay={date => {
					setOnDate(date)
					showModal(true)
				}}
				onClickMonth={date =>
					getAttendence({ variables: { month: date.getMonth(), year: date.getFullYear() } })
				}
			/>
			<Modal size="tiny" open={modal} onClose={() => showModal(false)}>
				<Modal.Header content={`Students present on ${getDate(onDate)}`} />
				<Modal.Content
					content={
						attendence && attendence.filter(_ => _.day === onDate.getDate()).length === 0 ? (
							<List.Item content="Record Unavailable !" />
						) : attendence &&
						  attendence.filter(_ => _.day === onDate.getDate() && _.holiday).length > 0 ? (
							<List.Item
								content={attendence.filter(_ => _.day === onDate.getDate() && _.holiday)[0].holiday}
							/>
						) : attendence &&
						  attendence.filter(
								_ => _.day === onDate.getDate() && !_.holiday && _.totalStudents === 0
						  ).length > 0 ? (
							<List.Item content="All students were absent !" />
						) : (
							attendence &&
							attendence.filter(_ => _.day === onDate.getDate() && !_.holiday).length > 0 && (
								<Menu vertical fluid>
									{data.students.map((student, idx) => (
										<Menu.Item
											link
											key={idx}
											disabled={
												!attendence
													.filter(_ => _.day === onDate.getDate())[0]
													.students.map(x => x._id)
													.includes(student._id)
											}
											onClick={() => history.push(`/student/` + student.username)}
											content={idx + 1 + `. ` + getName(student.name)}
										/>
									))}
								</Menu>
							)
						)
					}
				/>
			</Modal>

			<Dropdown
				fluid
				selection
				options={chartTypes}
				style={{ marginTop: `1rem` }}
				placeholder="Change chart type"
				onChange={(_, { value }) => chart.transform(value)}
			/>

			<div id="chart" style={{ marginTop: `1rem` }}></div>
		</>
	)
}

export default Attendence
