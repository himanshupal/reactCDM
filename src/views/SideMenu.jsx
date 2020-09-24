import Clock from "react-clock"
import { Link } from "react-router-dom"
import { Menu, Sidebar } from "semantic-ui-react"
import React, { useState, useEffect, useContext } from "react"

import { AuthContext } from "../common/context"

const SideMenu = ({ page, theme, visible, handleClick }) => {
	const {
		user: { access, username, classTeacherOf },
	} = useContext(AuthContext)

	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<Sidebar as={Menu} vertical width="thin" animation="uncover" visible={visible} inverted={theme}>
			<Menu.Item>
				<Clock size={106} value={time} />
			</Menu.Item>
			{access === `Student` ? (
				<>
					<Menu.Item name="home" active={page === "home"} onClick={handleClick} as={Link} to="/" />
					<Menu.Item
						name="notice board"
						active={page === "notice board"}
						onClick={handleClick}
						as={Link}
						to="/notices"
					/>
					<Menu.Item>
						<Menu.Header content="Profile" />
						<Menu.Menu>
							<Menu.Item
								name="about"
								active={page === `about`}
								onClick={handleClick}
								as={Link}
								to={`/student/` + username + `/about`}
							/>
							<Menu.Item
								name="attendence"
								active={page === `attendence`}
								onClick={handleClick}
								as={Link}
								to={`/student/` + username + `/attendence`}
							/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item
						name="notes"
						active={page === "notes"}
						onClick={handleClick}
						as={Link}
						to={`/student/` + username + `/notes`}
					/>
					<Menu.Item
						name="friends"
						active={page === "friends"}
						onClick={handleClick}
						as={Link}
						to={`/student/` + username + `/friends`}
					/>
				</>
			) : (
				<>
					<Menu.Item
						name="dashboard"
						active={page === "dashboard"}
						onClick={handleClick}
						as={Link}
						to="/"
					/>
					<Menu.Item
						name="notice board"
						active={page === "notice board"}
						onClick={handleClick}
						as={Link}
						to="/notices"
					/>
					{(access === `Director` || access === `Head of Department` || classTeacherOf) && (
						<Menu.Item>
							<Menu.Header content="Attendence" />
							<Menu.Menu>
								<Menu.Item
									name="day"
									active={page === "day"}
									onClick={handleClick}
									as={Link}
									to="/attendence"
								/>
								<Menu.Item
									name="month"
									active={page === "month"}
									onClick={handleClick}
									as={Link}
									to="/attendencemonth"
								/>
							</Menu.Menu>
						</Menu.Item>
					)}
					<Menu.Item>
						<Menu.Header content="Class" />
						<Menu.Menu>
							<Menu.Item
								name="classes"
								active={page === "classes"}
								onClick={handleClick}
								as={Link}
								to="/classes"
							/>
							<Menu.Item
								name="add subjects"
								active={page === "add subjects"}
								onClick={handleClick}
								as={Link}
								to="/addsubjects"
							/>
							<Menu.Item
								name="timetable"
								active={page === "timetable"}
								onClick={handleClick}
								as={Link}
								to="/timetable"
							/>
							<Menu.Item
								name="change timetable"
								active={page === "change timetable"}
								onClick={handleClick}
								as={Link}
								to="/edittimetable"
							/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header content="Student" />
						<Menu.Menu>
							<Menu.Item
								name="students"
								active={page === "students"}
								onClick={handleClick}
								as={Link}
								to="/students"
							/>
							<Menu.Item
								name="add student"
								active={page === "add student"}
								onClick={handleClick}
								as={Link}
								to="/addstudent"
							/>
							<Menu.Item
								name="update student"
								active={page === "update student"}
								onClick={handleClick}
								as={Link}
								to="/updatestudent"
							/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header content="Teacher" />
						<Menu.Menu>
							<Menu.Item
								name="teachers"
								active={page === "teachers"}
								onClick={handleClick}
								as={Link}
								to="/teachers"
							/>
							<Menu.Item
								name="add teacher"
								active={page === "add teacher"}
								onClick={handleClick}
								as={Link}
								to="/addteacher"
							/>
							<Menu.Item
								name="update teacher"
								active={page === "update teacher"}
								onClick={handleClick}
								as={Link}
								to="/updateteacher"
							/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header content="Department" />
						<Menu.Menu>
							{access === `Director` && (
								<Menu.Item
									name="departments"
									active={page === "departments"}
									onClick={handleClick}
									as={Link}
									to="/departments"
								/>
							)}
							<Menu.Item
								name="courses"
								active={page === "courses"}
								onClick={handleClick}
								as={Link}
								to="/courses"
							/>
							<Menu.Item
								name="new session"
								active={page === "new session"}
								onClick={handleClick}
								as={Link}
								to="/newsession"
							/>
						</Menu.Menu>
					</Menu.Item>
				</>
			)}
		</Sidebar>
	)
}

export default SideMenu
