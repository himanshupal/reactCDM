import React, { useContext } from "react"
import { Menu } from "semantic-ui-react"
import { useQuery } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"

import About from "./student/About"
import Notes from "./student/Notes"
import Friends from "./student/Friends"
import Attendence from "./student/Attendence"

import STUDENT from "../../queries/query/student"

import Loading from "../shared/Loading"
import Error from "../shared/Error"
import { getName } from "../shared/helpers"

const Student = ({
	theme,
	history,
	match: {
		params: { username, tab },
	},
}) => {
	const {
		user: { access },
	} = useContext(AuthContext)

	const { loading, error, data } = useQuery(STUDENT, { variables: { username } })

	if (loading) return <Loading />
	if (error) return <Error />

	const changeView = (_, { name }) => history.push(`/student/` + username + `/` + name)

	const name = getName(data.student.name)

	document.title = data ? name + ` | Select` : username

	return (
		<>
			{access !== `Student` && (
				<Menu pointing secondary inverted={theme} stackable>
					<Menu.Item name="about" active={tab === `about`} onClick={changeView} content="About" />
					<Menu.Item
						name="friends"
						active={tab === `friends`}
						onClick={changeView}
						content="Friends"
					/>
					<Menu.Item
						name="attendence"
						active={tab === `attendence`}
						onClick={changeView}
						content="Attendence"
					/>
				</Menu>
			)}

			{tab === `attendence` ? (
				<Attendence theme={theme} history={history} classId={data.student.class._id} name={name} />
			) : tab === `about` ? (
				<About
					theme={theme}
					access={access}
					history={history}
					username={username}
					data={data.student}
				/>
			) : tab === `notes` ? (
				<Notes theme={theme} username={username} name={name} />
			) : tab === `friends` ? (
				<Friends theme={theme} username={username} name={name} />
			) : (
				<h3 className="highlight">Select a Tab</h3>
			)}
		</>
	)
}

export default Student
