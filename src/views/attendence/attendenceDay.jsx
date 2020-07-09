import React, { useState, useEffect } from "react";
import "./attendenceDay.css";
import { Grid, Button } from "semantic-ui-react";
// import { useQuery } from "@apollo/react-hooks";

const students = ["Himanshu", "Arshad", "Ranvir", "Shivam", "Chetan", "Abhay"];
const ids = [
	"Himanshu:bcjkbsdjkbc",
	"Arshad:hxudghcdkhcja",
	"Ranvir:dakahdcajdjkd",
	"Shivam:xhsdcghjcgbjh",
	"Chetan:cdcwushixhsiu",
	"Abhay:csjgcjhjdchgdb",
];

const SingleStudent = ({ names, setPresent }) => {
	const [checked, setChecked] = useState(new Array(names.length).fill(false));
	const toggle = (index) =>
		setChecked(
			checked.map((val, idx) => {
				return idx === index ? !val : val;
			})
		);
	useEffect(() => {
		setPresent(checked);
	}, [checked, setPresent]);
	return names.map((name, idx) => (
		<Grid.Row verticalAlign="middle" textAlign="center" key={name}>
			<div>
				<label className="contract_toggle">
					{name}
					<input type="checkbox" onClick={() => toggle(idx)} />
					<div className="toggle_bar">
						<div className="toggle_square" />
					</div>
				</label>
			</div>
		</Grid.Row>
	));
};

const AttendenceDay = (props) => {
	const [present, setPresent] = useState([]);
	const [time, setTime] = useState(
		new Date()
			.toLocaleTimeString("en-in", {
				weekday: "short",
				year: "numeric",
				month: "long",
				day: "numeric",
			})
			.replace(/,/g, ``)
	);
	useEffect(() => {
		setInterval(() => {
			setTime(
				new Date()
					.toLocaleTimeString("en-us", {
						weekday: "short",
						year: "numeric",
						month: "long",
						day: "numeric",
					})
					.replace(/,/g, ``)
			);
		}, 1000);
	}, [time]);
	const submitStudents = () => {
		console.log(
			ids.filter((x, idx) => {
				return present[idx] ? x : null;
			})
		);
	};

	return (
		<Grid textAlign="center">
			<Grid.Row>
				<h1>{time}</h1>
			</Grid.Row>
			<Grid.Row columns="2">
				<Grid.Column textAlign="center">
					<h2>Total: {students.length}</h2>
				</Grid.Column>
				<Grid.Column textAlign="center" verticalAlign="middle">
					<h2>Present: {present.filter((x) => x).length}</h2>
				</Grid.Column>
			</Grid.Row>
			<SingleStudent names={students} setPresent={setPresent} />
			<div className="btn">
				<Button color="black" onClick={submitStudents}>
					Submit
				</Button>
				{/* <div className="btn-back">
					<p>Are you sure you want to submit the attendence?</p>
					<button className="yes">Yes</button>
					<button className="no">No</button>
				</div>
				<div className="btn-front">Submit</div> */}
			</div>
		</Grid>
	);
};
export default AttendenceDay;
