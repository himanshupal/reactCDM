// import MUTATION_ADD_ATTENDENCE_MANY from "../../queries/mutation/addAttendenceMany";
import { Table, Checkbox, Segment, Button, Grid, Dropdown } from "semantic-ui-react";
import QUERY_ATTENDENCE_MONTH from "../../queries/query/attendenceMonth";
// eslint-disable-next-line
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import React, { useState, useEffect } from "react";
import constants from "../common";

const MonthView = (props) => {
	const [currentMonth, setMonth] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
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
	const [confirm, setConfirm] = useState(false);
	const [variables, setVariables] = useState({});
	// const [notification, setNotification] = useState([]);
	const [previousAttendence, setPreviousAttendence] = useState([]);
	const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
	const [sundays, setSundays] = useState(getSundays(currentMonth.month, currentMonth.year));
	const [numberOfDays, setNumberOfDays] = useState(new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill());

	const prevMonth = () => {
		currentMonth.month > 0 ? setMonth({ ...currentMonth, month: currentMonth.month - 1 }) : setMonth({ month: 11, year: currentMonth.year - 1 });
		getAttendence();
	};
	const nextMonth = () => {
		currentMonth.month < 11 ? setMonth({ ...currentMonth, month: currentMonth.month + 1 }) : setMonth({ month: 0, year: currentMonth.year + 1 });
		getAttendence();
	};

	useEffect(() => {
		if (newData) {
			setDisDates([]);
			setConfirm(false);
			setPreviousAttendence(
				new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill(false).map((x, idx) =>
					newData.attendenceMonth && newData.attendenceMonth.map((y) => Number(y.day.split(`-`)[2])).includes(idx + 1)
						? newData.attendenceMonth
								.filter((y) => Number(y.day.split(`-`)[2]) === idx + 1)
								.map((y) => {
									return { students: y.students || [], holiday: y.holiday };
								})
						: x
				)
			);
		} else if (data) {
			setDisDates([]);
			setConfirm(false);
			setVariables({ cid: data.students[0].class._id });
			setPreviousAttendence(
				new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill(false).map((x, idx) =>
					data.attendenceMonth && data.attendenceMonth.map((y) => Number(y.day.split(`-`)[2])).includes(idx + 1)
						? data.attendenceMonth
								.filter((y) => Number(y.day.split(`-`)[2]) === idx + 1)
								.map((y) => {
									return { students: y.students || [], holiday: y.holiday };
								})
						: x
				)
			);
		}
	}, [data, newData, currentMonth]);

	useEffect(() => {
		setSundays(getSundays(currentMonth.month, currentMonth.year));
		setNumberOfDays(new Array(daysInMonth(currentMonth.month, currentMonth.year)).fill());
	}, [currentMonth]);

	useEffect(() => {
		setDisDates((disDates) => [...disDates, ...previousAttendence.map((x, idx) => x && x[0].holiday && idx).filter((x) => x)]);
	}, [previousAttendence]);

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
							<Dropdown
								inline
								search
								scrolling
								text={constants.months[currentMonth.month]}
								options={constants.months.map((x, idx) => {
									return { text: x, value: idx };
								})}
								onChange={(_, { value }) => {
									setMonth({ ...currentMonth, month: value });
									getAttendence();
								}}
							/>
							&nbsp;
							<Dropdown
								inline
								search
								scrolling
								text={currentMonth.year.toString()}
								options={new Array(new Date().getFullYear() - 1995).fill(new Date().getFullYear()).map((x, idx) => {
									return { text: (x - idx).toString(), value: x - idx };
								})}
								onChange={(_, { value }) => {
									setMonth({ ...currentMonth, year: value });
									getAttendence();
								}}
							/>
						</h3>
					</Grid.Column>
					<Grid.Column textAlign="right" verticalAlign="middle">
						<Button onClick={nextMonth} content="Next" icon="right arrow" labelPosition="right" />
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<Segment basic style={{ padding: 0 }}>
				<div style={{ overflowX: `scroll`, overflowY: `hidden` }}>
					<Table compact striped celled sortable selectable size="small" color="violet">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell verticalAlign="middle">Date →</Table.HeaderCell>
								{numberOfDays.map((_, date) => (
									<Table.HeaderCell
										verticalAlign="middle"
										textAlign="center"
										key={date}
										onDoubleClick={() => {
											setConfirm(false);
											if (sundays.includes(date)) return;
											setVariables((variables) => {
												data.students &&
													data.students.forEach(() => {
														variables = {
															...variables,
															[`students` + date]: data.students.map((x) => x._id),
															[`day` + date]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(date + 1)
																.toString()
																.padStart(2, 0)}`,
														};
													});
												return variables;
											});
										}}
										onClick={() => {
											setConfirm(false);
											if (sundays.includes(date)) return;
											variables[`holiday` + date]
												? setVariables((variables) => {
														delete variables[`holiday` + date];
														delete variables[`day` + date];
														return variables;
												  })
												: !disDates.includes(date) &&
												  setVariables((variables) => {
														delete variables[`students` + date];
														return {
															...variables,
															[`holiday` + date]: `Not Specified !`,
															[`day` + date]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(date + 1)
																.toString()
																.padStart(2, 0)}`,
														};
												  });
											disDates.includes(date) ? setDisDates(disDates.filter((x) => x !== date)) : setDisDates([...disDates, date]);
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
									<Table.Cell
										verticalAlign="middle"
										onDoubleClick={() => {
											setConfirm(false);
											setVariables((variables) => {
												numberOfDays.forEach((_, idx) => {
													variables = {
														...variables,
														[`students` + idx]:
															sundays.includes(idx) || disDates.includes(idx)
																? undefined
																: variables[`students` + idx]
																? variables[`students` + idx].includes(student._id)
																	? variables[`students` + idx]
																	: [...variables[`students` + idx], student._id]
																: [...(variables[`students` + idx] || []), student._id],
														[`day` + idx]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(idx + 1)
															.toString()
															.padStart(2, 0)}`,
													};
												});
												return variables;
											});
										}}
									>
										<em>
											{student.name.first}&nbsp;{student.name.last}
										</em>
									</Table.Cell>
									{numberOfDays.map((_, idx) => (
										<Table.Cell verticalAlign="middle" textAlign="center" key={idx}>
											{sundays.includes(idx) ? (
												<em>S</em>
											) : disDates.includes(idx) ? (
												<em>H</em>
											) : (
												<Checkbox
													checked={
														variables[`students` + idx]
															? variables[`students` + idx].includes(student._id)
															: previousAttendence[idx] && previousAttendence[idx][0].students.includes(student._id)
													}
													onClick={() => {
														setConfirm(false);
														variables[`students` + idx] && variables[`students` + idx].includes(student._id)
															? previousAttendence[idx] && previousAttendence[idx][0].students.includes(student._id)
																? setVariables((variables) => {
																		return {
																			...variables,
																			[`students` + idx]: [...variables[`students` + idx].filter((x) => x !== student._id)],
																		};
																  })
																: setVariables((variables) => {
																		if (variables[`students` + idx].length === 1) {
																			delete variables[`students` + idx];
																			delete variables[`day` + idx];
																			return { ...variables };
																		} else
																			return {
																				...variables,
																				[`students` + idx]: [...variables[`students` + idx].filter((x) => x !== student._id)],
																			};
																  })
															: previousAttendence[idx] && previousAttendence[idx][0].students.includes(student._id)
															? variables[`students` + idx] && !variables[`students` + idx].includes(student._id)
																? setVariables({
																		...variables,
																		[`students` + idx]: [...(variables[`students` + idx] || []), student._id],
																  })
																: setVariables((variables) => {
																		return {
																			...variables,
																			[`day` + idx]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(idx + 1)
																				.toString()
																				.padStart(2, 0)}`,
																			[`students` + idx]: previousAttendence[idx][0].students.filter((x) => x !== student._id),
																		};
																  })
															: setVariables({
																	...variables,
																	[`day` + idx]: `${currentMonth.year}-${(currentMonth.month + 1).toString().padStart(2, 0)}-${(idx + 1)
																		.toString()
																		.padStart(2, 0)}`,
																	[`students` + idx]: [...(variables[`students` + idx] || []), student._id],
															  });
													}}
												/>
											)}
										</Table.Cell>
									))}
								</Table.Row>
							))}
							<Table.Row>
								<Table.Cell textAlign="right">
									<b>Total :</b>
								</Table.Cell>
								{numberOfDays.map((_, idx) => (
									<Table.Cell key={idx} textAlign="center">
										{sundays.includes(idx) ? (
											<b>#</b>
										) : variables[`holiday` + idx] ? (
											0
										) : variables[`students` + idx] ? (
											variables[`students` + idx].length
										) : previousAttendence[idx] ? (
											previousAttendence[idx][0].students.length
										) : (
											0
										)}
									</Table.Cell>
								))}
							</Table.Row>
						</Table.Body>
						<Table.Footer fullWidth>
							<Table.Row>
								{confirm ? (
									<>
										<Table.HeaderCell colSpan={numberOfDays.length / 2 + 1}>
											<Button fluid color="green" as="p" onClick={() => console.log(variables)}>
												Yes
											</Button>
										</Table.HeaderCell>
										<Table.HeaderCell colSpan={numberOfDays.length % 2 === 0 ? numberOfDays.length / 2 : numberOfDays.length / 2 + 1}>
											<Button fluid color="youtube" as="p" onClick={() => setConfirm(false)}>
												No
											</Button>
										</Table.HeaderCell>
									</>
								) : (
									<Table.HeaderCell colSpan={numberOfDays.length + 1}>
										<Button fluid color="violet" as="p" disabled={Object.keys(variables).length <= 1} onClick={() => setConfirm(true)}>
											Submit
										</Button>
									</Table.HeaderCell>
								)}
							</Table.Row>
						</Table.Footer>
					</Table>
				</div>
			</Segment>
		</Segment>
	);
};

export default MonthView;
