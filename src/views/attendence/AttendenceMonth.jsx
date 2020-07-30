import MUTATION_ADD_ATTENDENCE_MANY from "../../queries/mutation/addAttendenceMany";
import { Table, Checkbox, Segment, Button, Grid } from "semantic-ui-react";
import QUERY_ATTENDENCE_MONTH from "../../queries/query/attendenceMonth";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../context/Auth";
// import Notify from "../../common/Notify";
import constants from "../common";

const MonthView = (props) => {
	const [currentMonth, setMonth] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
	// const { user } = useContext(AuthContext);
	const { loading, error, data } = useQuery(QUERY_ATTENDENCE_MONTH);
	const [getAttendence, { loading: change, data: newData }] = useLazyQuery(QUERY_ATTENDENCE_MONTH, {
		variables: { month: currentMonth.month, year: currentMonth.year },
	});
	const getSundays = (month, year) => {
		let dates = [];
		const firstDay = new Date(year, month, 1).getDay();
		if (firstDay === 0) dates = [...dates, 0];
		for (let d = 7 - firstDay; d <= new Date(year, month + 1, 0).getDate(); d += 7) dates = [...dates, d];
		return dates;
	};
	const [disDates, setDisDates] = useState([]);
	const [variables, setVariables] = useState({});
	// const [notification, setNotification] = useState([]);
	const [previousAttendence, setPreviousAttendence] = useState([]);
	const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
	const [sundays, setSundays] = useState(getSundays(currentMonth.month, currentMonth.year));
	const [numberOfDays, setNumberOfDays] = useState(new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill());

	const prevMonth = () => {
		currentMonth.month > 0
			? setMonth({ ...currentMonth, month: currentMonth.month - 1 })
			: setMonth({ month: 11, year: currentMonth.year - 1 });
		setVariables({ cid: data.students[0].class._id });
		getAttendence();
	};
	const nextMonth = () => {
		currentMonth.month < 11
			? setMonth({ ...currentMonth, month: currentMonth.month + 1 })
			: setMonth({ month: 0, year: currentMonth.year + 1 });
		setVariables({ cid: data.students[0].class._id });
		getAttendence();
	};

	useEffect(() => {
		if (newData)
			setPreviousAttendence(
				new Array(daysInMonth(currentMonth.month, currentMonth.year))
					.fill(false)
					.map((x, idx) =>
						newData.attendenceMonth && newData.attendenceMonth.map((y) => Number(y.day.split(`-`)[2])).includes(idx)
							? newData.attendenceMonth.filter((y) => Number(y.day.split(`-`)[2]) === idx).map((y) => y.students)
							: x
					)
			);
		else if (data) {
			setVariables({ cid: data.students[0].class._id });
			setPreviousAttendence(
				new Array(daysInMonth(currentMonth.month, currentMonth.year))
					.fill(false)
					.map((x, idx) =>
						data.attendenceMonth && data.attendenceMonth.map((y) => Number(y.day.split(`-`)[2])).includes(idx)
							? data.attendenceMonth.filter((y) => Number(y.day.split(`-`)[2]) === idx).map((y) => y.students)
							: x
					)
			);
		}
	}, [data, newData]);
	useEffect(() => {
		setSundays(getSundays(currentMonth.month, currentMonth.year));
		setNumberOfDays(new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill());
	}, [currentMonth]);

	if (loading) return <h2>Loading...</h2>;
	if (error) return <h2>{error.toString().split(`: `)[2]}</h2>;

	return (
		<Segment className={change ? `loading` : ``}>
			<Grid>
				<Grid.Row columns="3">
					<Grid.Column verticalAlign="middle">
						<Button onClick={prevMonth} content="Previous" icon="left arrow" labelPosition="left" />
					</Grid.Column>
					<Grid.Column textAlign="center" verticalAlign="middle">
						<h3>
							{constants.months[currentMonth.month]}, {currentMonth.year}
						</h3>
					</Grid.Column>
					<Grid.Column textAlign="right" verticalAlign="middle">
						<Button onClick={nextMonth} content="Next" icon="right arrow" labelPosition="right" />
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<Segment basic style={{ padding: 0 }}>
				<div style={{ overflowX: `scroll`, overflowY: `hidden` }}>
					<Table compact striped celled sortable size="small" color="violet">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell verticalAlign="middle" textAlign="center">
									Date →{/* <br />
									Students ↓ */}
								</Table.HeaderCell>
								{numberOfDays.map((_, date) => (
									<Table.HeaderCell
										verticalAlign="middle"
										textAlign="center"
										key={date}
										onClick={() => {
											if (sundays.includes(date)) return;
											disDates.includes(date) ? setDisDates(disDates.filter((x) => x !== date)) : setDisDates([...disDates, date]);
											variables[`holiday` + date]
												? setVariables((variables) => {
														delete variables[`holiday` + date];
														delete variables[`day` + date];
														return variables;
												  })
												: setVariables((variables) => {
														delete variables[`students` + date];
														return {
															...variables,
															[`holiday` + date]: `Not Specified !`,
															[`day` + date]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(date + 1)
																.toString()
																.padStart(2, 0)}`,
														};
												  });
										}}
									>
										{date + 1}
									</Table.HeaderCell>
								))}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{data.students.map((student, idx) => (
								<Table.Row key={idx}>
									<Table.Cell verticalAlign="middle">
										<b>
											{student.name.first}&nbsp;{student.name.last}
										</b>
									</Table.Cell>
									{numberOfDays.map((_, idx) => (
										<Table.Cell verticalAlign="middle" textAlign="center" key={idx}>
											{sundays.includes(idx) ? (
												`S`
											) : disDates.includes(idx) ? (
												`H`
											) : (
												<Checkbox
													// disabled={disDates.includes(idx)}
													checked={
														variables[`students` + idx]
															? variables[`students` + idx].includes(student._id)
															: previousAttendence[idx + 1] && previousAttendence[idx + 1][0].includes(student._id)
													}
													onClick={() =>
														variables[`students` + idx] && variables[`students` + idx].includes(student._id)
															? setVariables((variables) => {
																	return {
																		...variables,
																		[`students` + idx]: [...variables[`students` + idx].filter((x) => x !== student._id)],
																	};
																	// if (variables[`students` + idx].length === 1) {
																	// 	delete variables[`students` + idx];
																	// 	return { ...variables };
																	// } else
															  })
															: previousAttendence[idx + 1] && previousAttendence[idx + 1][0].includes(student._id)
															? variables[`students` + idx] && !variables[`students` + idx].includes(student._id)
																? setVariables({
																		...variables,
																		[`students` + idx]: [...(variables[`students` + idx] || []), student._id],
																  })
																: setVariables((variables) => {
																		return {
																			...variables,
																			[`day` + idx]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(
																				idx + 1
																			)
																				.toString()
																				.padStart(2, 0)}`,
																			[`students` + idx]: previousAttendence[idx + 1][0].filter((x) => x !== student._id),
																		};
																  })
															: setVariables({
																	...variables,
																	[`day` + idx]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(
																		idx + 1
																	)
																		.toString()
																		.padStart(2, 0)}`,
																	[`students` + idx]: [...(variables[`students` + idx] || []), student._id],
															  })
													}
												/>
											)}
										</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
						<Table.Footer fullWidth>
							<Table.Row>
								<Table.HeaderCell colSpan={numberOfDays.length + 1}>
									<Button fluid as="p" disabled={Object.keys(variables).length <= 1} onClick={() => console.log(variables)}>
										Submit
									</Button>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					</Table>
				</div>
			</Segment>
		</Segment>
	);
};

export default MonthView;
