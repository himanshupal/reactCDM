import React from "react";
import Home from "../views/home";
import MonthView from "../views/attendence/monthView";
import AttendenceDay from "../views/attendence/attendenceDay";
import Navigator from "../common/navigator";
import AddClass from "../views/class/addClass";
import AddSubject from "../views/class/addSubject";
import Login from "../views/auth/Login";
import NewStudent from "../views/students/newStudent";
import NewTeacher from "../views/teachers/newTeacher";
import Logout from "../views/auth/Logout";
import { AuthProvider } from "../context/Auth";
import NoReturn from "./protectedRoute";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route } from "react-router-dom";
import SideNavigation from "../common/side nav";
const Router = (props) => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navigator />
				<SideNavigation/>
				<Container>
					{/* <Container textAlign="center"> */}
					<Route exact path="/" component={Home} />
					<Route exact path="/logout" component={Logout} />
					<Route exact path="/month" component={MonthView} />
					<Route exact path="/addclass" component={AddClass} />
					<Route exact path="/addsubject" component={AddSubject} />
					<Route exact path="/day" component={AttendenceDay} />
					<Route exact path="/newstudent" component={NewStudent} />
					<Route exact path="/newteacher" component={NewTeacher} />
					<NoReturn exact path="/login" component={Login} />
				</Container>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default Router;
