// import gql from "graphql-tag";
import "./table.css";
import React, { useState, useEffect } from "react";
import { Table, Checkbox, Segment, Button, Grid } from "semantic-ui-react";
// import { useQuery } from "@apollo/react-hooks";

const students = ["Himanshu", "Arshad", "Ranvir", "Suyash", "Shivam", "Chetan"];

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const EachDay = ({ date, student, allStudents }) => {
	const [checked, setChecked] = useState([]);
	useEffect(() => {
		// setChecked(allStudents);
		const addDay = allStudents.filter((x) => {
			if (!checked.includes(x)) return x;
			return;
		});
		setChecked([...checked, Number(addDay)]);
	}, [allStudents]);
	console.log(checked);
	const toggle = (index) =>
		!checked.includes(index)
			? setChecked([...checked, index])
			: setChecked(
					checked.filter((val) => {
						return val !== index;
					})
			  );
	return date.map((day) => (
		<Table.Cell verticalAlign="middle" textAlign="center" key={day}>
			<Checkbox checked={checked.includes(day)} onClick={() => toggle(day)} />
		</Table.Cell>
	));
};

const SingleStudent = ({ stName, days, allStudents }) =>
	stName.map((student, idx) => (
		<Table.Row key={idx}>
			<Table.Cell verticalAlign="middle">{student}</Table.Cell>
			<EachDay
				student={student}
				allStudents={allStudents}
				date={new Array(daysInMonth(days.month, days.year))
					.fill()
					.map((_, x) => ++x)}
			/>
		</Table.Row>
	));

const MonthView = (props) => {
	const [month, setMonth] = useState({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});
	const [setChecked, selectsetChecked] = useState([]);
	// const [data, setData] = useState([
	// 	{
	// 		day: String,
	// 		students: [],
	// 	},
	// ]);
	const prevMonth = () =>
		month.month > 0
			? setMonth({ ...month, month: month.month - 1 })
			: setMonth({ month: 11, year: month.year - 1 });
	const nextMonth = () =>
		month.month < 11
			? setMonth({ ...month, month: month.month + 1 })
			: setMonth({ month: 0, year: month.year + 1 });
	const headerClicked = (date) =>
		!setChecked.includes(date)
			? selectsetChecked([...setChecked, date])
			: selectsetChecked(
					setChecked.filter((val) => {
						return val !== date;
					})
			  );

	return (
		<Segment>
			<Grid>
				<Grid.Row columns="3">
					<Grid.Column textAlign="left">
						<Button onClick={prevMonth}>Previous</Button>
					</Grid.Column>
					<Grid.Column>
						Showing {month.month + 1}, {month.year}
					</Grid.Column>
					<Grid.Column textAlign="right">
						<Button onClick={nextMonth}>Next</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			<Segment basic>
				<div className="tableSegment">
					<Table
						compact
						// selectable
						striped
						celled
						sortable
						size="small"
						color="violet"
					>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell verticalAlign="middle" textAlign="center">
									{/*Students ↓*/} Date →
								</Table.HeaderCell>
								{new Array(daysInMonth(month.month, month.year))
									.fill()
									.map((_, date) => (
										<Table.HeaderCell
											verticalAlign="middle"
											textAlign="center"
											onClick={() => headerClicked(date)}
											key={++date}
										>
											{date}
										</Table.HeaderCell>
									))}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<SingleStudent
								stName={students}
								days={month}
								allStudents={setChecked}
							/>
						</Table.Body>
					</Table>
				</div>
			</Segment>
		</Segment>
	);
};

export default MonthView;
