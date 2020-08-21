import { AuthContext } from "../common/context"
import React, { useState, useContext } from "react"
import { Route, Redirect, Link } from "react-router-dom"
import { Container, Button, Menu, Sidebar, Icon } from "semantic-ui-react"

const SideMenu = ({ page, theme, visible, handleClick }) => (
	<Sidebar as={Menu} vertical animation="slide along" visible={visible} width="thin" inverted={theme}>
		<Menu.Item name="home" active={page === "home"} onClick={handleClick} as={Link} to="/" />
		<Menu.Item name="add course" active={page === "add course"} onClick={handleClick} as={Link} to="/addcourse" />
		<Menu.Item name="new session" active={page === "new session"} onClick={handleClick} as={Link} to="/newsession" />
		<Menu.Item name="add subject" active={page === "add subject"} onClick={handleClick} as={Link} to="/addsubject" />
		<Menu.Item name="add teacher" active={page === "add teacher"} onClick={handleClick} as={Link} to="/addteacher" />
		<Menu.Item name="teachers" active={page === "teachers"} onClick={handleClick} as={Link} to="/teachers" />
		<Menu.Item name="students" active={page === "students"} onClick={handleClick} as={Link} to="/students" />
		<Menu.Item name="add student" active={page === "add student"} onClick={handleClick} as={Link} to="/addstudent" />
		<Menu.Item name="attendence" active={page === "attendence"} onClick={handleClick} as={Link} to="/attendence" />
		<Menu.Item name="attendence month" active={page === "attendence month"} onClick={handleClick} as={Link} to="/attendencemonth" />
		<Menu.Item name="timetable" active={page === "timetable"} onClick={handleClick} as={Link} to="/timetable" />
		<Menu.Item name="change timetable" active={page === "change timetable"} onClick={handleClick} as={Link} to="/addtimetable" />
	</Sidebar>
)

const Navigator = ({ component: Component, ...props }) => {
	const { user, theme, toggleTheme, page, setPage, logout } = useContext(AuthContext)

	const [visible, setVisible] = useState(false)
	const handleClick = (_, { name }) => {
		setVisible(false)
		setPage(name)
	}

	return (
		<Route
			render={props =>
				user ? (
					<Sidebar.Pushable style={{ minHeight: `100vh` }}>
						<SideMenu page={page} theme={theme} visible={visible} handleClick={handleClick} />
						<Sidebar.Pusher style={{ background: theme ? `#333` : `white`, minHeight: `100vh` }}>
							<Menu borderless attached="bottom" inverted={theme}>
								<Menu.Item content={<Button icon="sidebar" onClick={() => setVisible(visible => !visible)} />} />
								<Menu.Menu position="right">
									<Menu.Item name="theme" content={<Icon size="large" onClick={toggleTheme} name="sun" />} style={{ cursor: `pointer` }} />
									<Menu.Item name="logout" onClick={logout} as={Link} to="/login" />
								</Menu.Menu>
							</Menu>
							<Container onClick={() => setVisible(false)}>
								<Component {...{ ...props, theme }} />
							</Container>
						</Sidebar.Pusher>
					</Sidebar.Pushable>
				) : (
					<Redirect to="/login" />
				)
			}
			{...props}
		/>
	)
}

export default Navigator
