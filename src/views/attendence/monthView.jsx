import gql from "graphql-tag";
import "./table.css";
import React, { useState } from "react";
import { Table, Checkbox, Input, Button, Grid, Form } from "semantic-ui-react";
// import { useQuery } from "@apollo/react-hooks";

const students = ["Himanshu", "Arshad", "Ranvir", "Shivam", "Chetan"];

const daysInMonth = (month, year) => {
	return new Date(year, month + 1, 0).getDate();
};

const EachDay = ({ date }) => {
	return date.map((day) => (
		<Table.Cell
			verticalAlign="middle"
			textAlign="center"
			onClick={(day) => {
				return day++;
			}}
			key={day}
		>
			<Checkbox toggle />
		</Table.Cell>
	));
};

const SingleStudent = ({ stName }) =>
	stName.map((student, idx) => (
		<Table.Row>
			<Table.Cell verticalAlign="middle">{student}</Table.Cell>
			<EachDay key={idx} date={new Array(31).fill().map((_, x) => ++x)} />
		</Table.Row>
	));

const MonthView = (props) => {
	let fgh;
	const [month, changeMonth] = useState({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});
	const [classs, changeClasss] = useState(``);
	const classsChange = (event) => changeClasss(event.target.value);
	const getClass = () => {
		console.log(classs);
		fgh = classs;
	};

	return (
		<Grid celled>
			<Grid.Row>
				<Grid.Column>
					<Form onSubmit={getClass}>
						<Form.Input
							onChange={classsChange}
							label="Search Class:"
							value={classs}
							fluid
						/>
						<Button fluid>Search</Button>
					</Form>
				</Grid.Column>
			</Grid.Row>
			{classs && (
				<Grid.Row>
					<Grid.Column>
						<div className="tableSegment">
							<Table unstackable color="violet" selectable striped>
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
													key={date}
												>
													{++date}
												</Table.HeaderCell>
											))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<SingleStudent stName={students} />
								</Table.Body>
							</Table>
						</div>
					</Grid.Column>
				</Grid.Row>
			)}
		</Grid>
	);
};

// const CLASS_DETAILS = gql`
// 	query getClassDetails() {
// 		getClass(_id: "BCA-2nd-Yr") {
// 			className
// 			classTeacher
// 			students {
// 				name {
// 					first
// 				}
// 			}
// 			totalStudents
// 			attendence {
// 				totalStudents
// 				createdAt
// 				lastUpdated
// 				holiday
// 				students
// 			}
// 		}
// 	}
// `;

export default MonthView;
