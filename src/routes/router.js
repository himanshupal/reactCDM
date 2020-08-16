import React from "react"
import { Container } from "semantic-ui-react"
import { BrowserRouter, Route } from "react-router-dom"

import NoReturn from "./protectedRoute"
import Navigator from "../common/navigator"
import { AuthProvider } from "../common/context"

import Home from "../views/home"

import AddCourse from "../views/course/AddCourse"
import NewSession from "../views/course/NewSesssion"
import AddSubject from "../views/class/AddSubject"

import Teachers from "../views/teachers/Teachers"
import Teacher from "../views/teachers/Teacher"
import AddTeacher from "../views/teachers/AddTeacher"

import Students from "../views/students/Students"
import Student from "../views/students/Student"
import AddStudent from "../views/students/AddStudent"

import Attendence from "../views/attendence/Attendence"
import AttendenceMonth from "../views/attendence/AttendenceMonth"

import TimeTable from "../views/class/TimeTable"
import CreateTimeTable from "../views/class/ChangeTimeTable"

import Login from "../views/auth/Login"

const Router = () => (
	<AuthProvider>
		<BrowserRouter>
			<Navigator />

			<Container>
				<Route exact path="/" component={Home} />

				<Route exact path="/addcourse" component={AddCourse} />
				<Route exact path="/newsession" component={NewSession} />
				<Route exact path="/addsubject" component={AddSubject} />

				<Route exact path="/teachers" component={Teachers} />
				<Route exact path="/addteacher" component={AddTeacher} />
				<Route exact path="/teacher/:username" component={Teacher} />
				<Route exact path="/updateteacher" component={() => <AddTeacher update />} />

				<Route exact path="/students" component={Students} />
				<Route exact path="/addstudent" component={AddStudent} />
				<Route exact path="/students/:username" component={Student} />
				<Route exact path="/updatestudent" component={() => <AddStudent update />} />

				<Route exact path="/attendence" component={Attendence} />
				<Route exact path="/attendencemonth" component={AttendenceMonth} />

				<Route exact path="/timetable" component={TimeTable} />
				<Route exact path="/addtimetable" component={CreateTimeTable} />

				<NoReturn exact path="/login" component={Login} />
			</Container>
		</BrowserRouter>
	</AuthProvider>
)

export default Router
