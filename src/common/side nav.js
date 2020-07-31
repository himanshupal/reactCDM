import React from "react";
import { Link } from "react-router-dom";
const SideNavigation = () => (
	<React.Fragment>
		<Navigation />
	</React.Fragment>
);

class Navigation extends React.Component {
	constructor() {
		super();
		this.state = {
			isActive: false,
		};
	}

	handleToggle = () => {
		const { isActive } = this.state;
		this.setState({ isActive: !isActive });
	};

	handleSelect = () => {
		this.setState({ isActive: false });
	};

	render() {
		const { isActive } = this.state;
		const iconCls = `navigation__icon ${isActive ? "transformed" : ""}`;
		const navCls = isActive ? "navigation--active" : "";
		return (
			<div className="navigation">
				<div className="navigation__toggle" onClick={this.handleToggle}>
					<div className={iconCls}>
						<span></span>
					</div>
				</div>
				<nav className={navCls}>
					<div className="navigation__brand">Jump to</div>
					<ul>
						<li>
							<Link to="/addstudent">Add Student</Link>
						</li>
						<li>
							<Link to="/updatestudent">Update Student</Link>
						</li>
						<li>
							<Link to="/addteacher">Add Teacher</Link>
						</li>
						<li>
							<Link to="/updateteacher">Update Teacher</Link>
						</li>
						<li>
							<Link to="/addsubject">Add Subject</Link>
						</li>
						<li>
							<Link to="/addcourse">Add Course</Link>
						</li>
						<li>
							<Link to="/newsession">Change Session</Link>
						</li>
					</ul>
				</nav>
			</div>
		);
	}
}
export default SideNavigation;
