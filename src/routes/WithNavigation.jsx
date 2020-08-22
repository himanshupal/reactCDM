import SideMenu from "../views/SideMenu"
import { AuthContext } from "../common/context"
import React, { useState, useContext } from "react"
import { Route, Redirect, Link } from "react-router-dom"
import { Container, Button, Menu, Sidebar, Icon } from "semantic-ui-react"

import ChangePassword from "../views/auth/ChangePassword"

const Navigator = ({ component: Component, ...props }) => {
	const [visible, setVisible] = useState(false)
	const [newPwd, setNewPwd] = useState(false)
	const { user, theme, toggleTheme, page, setPage, logout } = useContext(AuthContext)

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
							<Menu borderless attached="bottom" inverted={theme} color="black">
								<Menu.Item
									content={<Button circular color={theme ? `black` : null} icon="sidebar" onClick={() => setVisible(visible => !visible)} />}
								/>
								<Menu.Menu position="right">
									<Menu.Item name="theme" content={<Icon size="large" onClick={toggleTheme} name="sun" />} style={{ cursor: `pointer` }} />
									<Menu.Item name="Change Password" onClick={() => setNewPwd(newPwd => !newPwd)} as="a" />
									<Menu.Item name="logout" onClick={logout} as={Link} to="/login" />
								</Menu.Menu>
							</Menu>
							<Container onClick={() => setVisible(false)} content={<Component {...{ ...props, theme }} />} />
							<ChangePassword newPwd={newPwd} setNewPwd={setNewPwd} />
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
