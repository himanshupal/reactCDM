import React from "react"
import { Route, Switch, BrowserRouter } from "react-router-dom"
import WithNavigation from "./WithNavigation"
import LoginReturnLock from "./LoginReturnLock"
import { AuthProvider } from "../common/context"

import Dashboard from "../views/Dashboard"

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
import NotFound from "../views/NotFound"

const Router = () => (
	<AuthProvider>
		<BrowserRouter>
			<Switch>
				<WithNavigation exact path="/" component={Dashboard} />
				<WithNavigation exact path="/addcourse" component={AddCourse} />
				<WithNavigation exact path="/newsession" component={NewSession} />
				<WithNavigation exact path="/addsubject" component={AddSubject} />
				<WithNavigation exact path="/teachers" component={Teachers} />
				<WithNavigation exact path="/addteacher" component={AddTeacher} />
				<WithNavigation exact path="/teacher/:username" component={Teacher} />
				<WithNavigation exact path="/updateteacher" component={() => <AddTeacher update />} />
				<WithNavigation exact path="/students" component={Students} />
				<WithNavigation exact path="/addstudent" component={AddStudent} />
				<WithNavigation exact path="/students/:username/" component={Student} />
				<WithNavigation exact path="/students/:username/:tab" component={Student} /> {/* Side Menu Tab */}
				<WithNavigation exact path="/students/:username/:tab/:item" component={Student} /> {/* Top Menu Item */}
				<WithNavigation exact path="/updatestudent" component={() => <AddStudent update />} />
				<WithNavigation exact path="/attendence" component={Attendence} />
				<WithNavigation exact path="/attendencemonth" component={AttendenceMonth} />
				<WithNavigation exact path="/timetable" component={TimeTable} />
				<WithNavigation exact path="/addtimetable" component={CreateTimeTable} />
				<LoginReturnLock exact path="/login" component={Login} />
				<Route component={NotFound} />
			</Switch>
		</BrowserRouter>
	</AuthProvider>
)

export default Router
