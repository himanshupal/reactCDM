import React from "react"
import { Route, Switch, BrowserRouter } from "react-router-dom"
import WithNavigation from "./WithNavigation"
import LoginReturnLock from "./LoginReturnLock"
import { AuthProvider } from "../common/context"

import Dashboard from "../views/Dashboard"
import Notices from "../views/notices/Notices"
import Notice from "../views/notices/Notice"

import NewSession from "../views/course/NewSesssion"
import AddSubjects from "../views/class/AddSubjects"

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

import Departments from "../views/department/Departments"
import Courses from "../views/course/Courses"
import Classes from "../views/class/Classes"

const Router = () => (
	<AuthProvider>
		<BrowserRouter>
			<Switch>
				<WithNavigation exact path="/" component={Dashboard} />
				<WithNavigation exact path="/notices" component={Notices} />
				<WithNavigation exact path="/notice/:_id" component={Notice} />
				<WithNavigation exact path="/newsession" component={NewSession} />
				<WithNavigation exact path="/addsubjects" component={AddSubjects} />
				<WithNavigation exact path="/teachers" component={Teachers} />
				<WithNavigation exact path="/addteacher" component={AddTeacher} />
				<WithNavigation exact path="/teacher/:username" component={Teacher} />
				<WithNavigation exact path="/teacher/:username/update" component={AddTeacher} />
				<WithNavigation exact path="/students" component={Students} />
				<WithNavigation exact path="/addstudent" component={AddStudent} />
				<WithNavigation exact path="/student/:username" component={Student} />
				<WithNavigation exact path="/student/:username/update" component={AddStudent} />
				<WithNavigation exact path="/student/:username/:tab" component={Student} />
				<WithNavigation exact path="/attendence" component={Attendence} />
				<WithNavigation exact path="/attendencemonth" component={AttendenceMonth} />
				<WithNavigation exact path="/timetable" component={TimeTable} />
				<WithNavigation exact path="/edittimetable" component={CreateTimeTable} />
				<WithNavigation exact path="/departments" component={Departments} />
				<WithNavigation exact path="/courses" component={Courses} />
				<WithNavigation exact path="/classes" component={Classes} />
				<LoginReturnLock exact path="/login" component={Login} />
				<Route component={NotFound} />
			</Switch>
		</BrowserRouter>
	</AuthProvider>
)

export default Router
