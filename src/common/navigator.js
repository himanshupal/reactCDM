import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Navigator = (props) => {
	const [activeItem, setActiveItem] = useState(`login`),
		handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<div>
			<Menu pointing style={{ marginBottom: `1.5rem` }}>
				<Menu.Item name="student profile" active={activeItem === "student profile"} onClick={handleItemClick} as={Link} to="/" />
				<Menu.Item name="timetable" active={activeItem === "timetable"} onClick={handleItemClick} as={Link} to="/timetable" />
				<Menu.Item name="add subject" active={activeItem === "add subject"} onClick={handleItemClick} as={Link} to="/addsubject" />
				<Menu.Item name="add course" active={activeItem === "add course"} onClick={handleItemClick} as={Link} to="/addcourse" />
				<Menu.Item name="new session" active={activeItem === "new session"} onClick={handleItemClick} as={Link} to="/newsession" />
				<Menu.Item name="add teacher" active={activeItem === "add teacher"} onClick={handleItemClick} as={Link} to="/addteacher" />
				<Menu.Item name="add student" active={activeItem === "add student"} onClick={handleItemClick} as={Link} to="/addstudent" />
				<Menu.Item name="teachers" active={activeItem === "teachers"} onClick={handleItemClick} as={Link} to="/teachers" />
				<Menu.Item name="attendence" active={activeItem === "attendence"} onClick={handleItemClick} as={Link} to="/attendence" />
				<Menu.Item name="attendence month" active={activeItem === "attendence month"} onClick={handleItemClick} as={Link} to="/attendencemonth" />
				{/* <Menu.Item name="logout" active={activeItem === "logout"} onClick={handleItemClick} as={Link} to="/logout" /> */}
				<Menu.Menu position="right">
					<Menu.Item name="login" active={activeItem === "login"} onClick={handleItemClick} as={Link} to="/login" />
				</Menu.Menu>
			</Menu>
		</div>
	);
};

export default Navigator;
