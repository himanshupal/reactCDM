import React from "react";
import Home from "../views/home";
import AddCourse from "../views/course/AddCourse";
import AddSubject from "../views/class/AddSubject";
import TimeTable from "../views/class/TimeTable";
import NewSession from "../views/course/NewSesssion";
import AddTeacher from "../views/teachers/AddTeacher";
import AddStudent from "../views/students/AddStudent";
import Students from "../views/students/Students";
import Student from "../views/students/Student";
import Login from "../views/auth/Login";
import Attendence from "../views/attendence/Attendence";
import AttendenceMonth from "../views/attendence/AttendenceMonth";

import Navigator from "../common/navigator";
// import AddClass from "../views/class/AddClass";
import Logout from "../views/auth/Logout";
import { AuthProvider } from "../context/Auth";
import NoReturn from "./protectedRoute";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route } from "react-router-dom";
import SideNavigation from "../common/side nav";
import Calendar from "../views/attendence/Calendar";

const Router = (props) => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navigator />
				<SideNavigation />
				<Container>
					{/* <Container textAlign="center"> */}
					<Route exact path="/" component={Home} />
					<Route exact path="/calendar" component={Calendar} />
					<Route exact path="/addcourse" component={AddCourse} />
					<Route exact path="/newsession" component={NewSession} />
					<Route exact path="/addteacher" component={AddTeacher} />
					<Route exact path="/updateteacher" component={() => <AddTeacher update />} />
					<Route exact path="/addstudent" component={AddStudent} />
					<Route exact path="/updatestudent" component={() => <AddStudent update />} />
					<Route exact path="/students" component={Students} />
					<Route exact path="/attendence" component={Attendence} />
					<Route exact path="/attendencemonth" component={AttendenceMonth} />
					<Route exact path="/timetable" component={TimeTable} />
					<Route exact path="/students/:username" component={Student} />
					<Route exact path="/logout" component={Logout} />
					{/* <Route exact path="/addclass" component={AddClass} /> */}
					<Route exact path="/addsubject" component={AddSubject} />
					<NoReturn exact path="/login" component={Login} />
				</Container>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default Router;
