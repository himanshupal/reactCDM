import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Navigator = (props) => {
	const [activeItem, setActiveItem] = useState(`login`),
		handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<div>
			<Menu pointing secondary>
				<Menu.Item
					name="home"
					active={activeItem === "home"}
					onClick={handleItemClick}
					as={Link}
					to="/"
				/>
				<Menu.Item
					name="month"
					active={activeItem === "month"}
					onClick={handleItemClick}
					as={Link}
					to="/month"
				/>
				<Menu.Item
					name="logout"
					active={activeItem === "logout"}
					onClick={handleItemClick}
					as={Link}
					to="/logout"
				/>
				<Menu.Menu position="right">
					<Menu.Item
						name="login"
						active={activeItem === "login"}
						onClick={handleItemClick}
						as={Link}
						to="/login"
					/>
				</Menu.Menu>
			</Menu>
		</div>
	);
};

export default Navigator;
