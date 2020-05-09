import React from "react";
import Home from "../views/home";
import MonthView from "../views/attendence/monthView";
import AttendenceDay from "../views/attendence/attendenceDay";
import Navigator from "../common/navigator";
import Login from "../views/auth/Login";
import Logout from "../views/auth/Logout";
import { AuthProvider } from "../context/Auth";
import NoReturn from "./protectedRoute";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route } from "react-router-dom";

const Router = (props) => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navigator />
				<Container>
					<Route exact path="/" component={Home} />
					<Route exact path="/logout" component={Logout} />
					<Route exact path="/month" component={MonthView} />
					<Route exact path="/day" component={AttendenceDay} />
					{/* <Route exact path="/addteacher" component={AddStudent} />
					<Route exact path="/addstudent" component={AddTeacher} /> */}
					<NoReturn exact path="/login" component={Login} />
				</Container>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default Router;
