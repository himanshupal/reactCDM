import React, { useState, useContext } from "react"
import { AuthContext } from "./context"
import { Menu } from "semantic-ui-react"
import { Link } from "react-router-dom"

const Navigator = () => {
	const { logout } = useContext(AuthContext)

	const [activeItem, setActiveItem] = useState(`home`)
	const handleClick = (_, { name }) => setActiveItem(name)

	return (
		<Menu pointing style={{ marginBottom: `1.5rem` }}>
			<Menu.Item name="home" active={activeItem === "home"} onClick={handleClick} as={Link} to="/" />

			<Menu.Item name="add course" active={activeItem === "add course"} onClick={handleClick} as={Link} to="/addcourse" />
			<Menu.Item name="new session" active={activeItem === "new session"} onClick={handleClick} as={Link} to="/newsession" />
			<Menu.Item name="add subject" active={activeItem === "add subject"} onClick={handleClick} as={Link} to="/addsubject" />

			<Menu.Item name="add teacher" active={activeItem === "add teacher"} onClick={handleClick} as={Link} to="/addteacher" />
			<Menu.Item name="teachers" active={activeItem === "teachers"} onClick={handleClick} as={Link} to="/teachers" />

			<Menu.Item name="students" active={activeItem === "students"} onClick={handleClick} as={Link} to="/students" />
			<Menu.Item name="add student" active={activeItem === "add student"} onClick={handleClick} as={Link} to="/addstudent" />

			<Menu.Item name="attendence" active={activeItem === "attendence"} onClick={handleClick} as={Link} to="/attendence" />
			<Menu.Item name="attendence month" active={activeItem === "attendence month"} onClick={handleClick} as={Link} to="/attendencemonth" />

			<Menu.Item name="timetable" active={activeItem === "timetable"} onClick={handleClick} as={Link} to="/timetable" />
			<Menu.Item name="change timetable" active={activeItem === "change timetable"} onClick={handleClick} as={Link} to="/addtimetable" />

			<Menu.Menu position="right">
				<Menu.Item name="login" active={activeItem === "login"} onClick={handleClick} as={Link} to="/login" />
				<Menu.Item name="logout" active={activeItem === "logout"} onClick={logout} as={Link} to="/login" />
			</Menu.Menu>
		</Menu>
	)
}

export default Navigator
