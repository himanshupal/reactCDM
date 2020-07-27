import React, { Component } from 'react';
var username = "student name";
var usertitle = "deartment,course";
var currentView = "overview";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: "overview"	
		};
		this.setView = this.setView.bind(this);
	}

	setView(view) {
		this.setState({ view: view });
		currentView = view;
		console.log(view);
	}

	render() {
		switch(this.state.view) {
			case "overview":
				return (
				<div id="dashboard">
					<Sidebar setView={this.setView} />
					<Overview />
				</div>
			);
			case "schedule":
			return (
				<div id="dashboard">
					<Sidebar setView={this.setView} />
					<ScheduleView />
				</div>
			);
			case "performance":
			return (
				<div id="dashboard">
					<Sidebar setView={this.setView} />
					<PerformanceView />
				</div>
			);
		case "administrator":
			return (
				<div id="dashboard">
					<Sidebar setView={this.setView} />
					<AdministratorView />
				</div>
			);
		}
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
	}
	setView(view) {
		this.props.setView(view);
		console.log("level 2 " + view);
	}
	render() {
		return (
			<div class="sidebar-menu">
				<UserProfileView username={username} usertitle={usertitle} />
				<SidebarMenu
					item1={"Overview"}
					item2={"Schedule"}
					item3={"Performance"}
					item4={"Administration"}
					setView={this.props.setView}
				/>
				<div>
					<button id="sign-out-btn" class="full-btn">
						Sign Out
					</button>
				</div>
			</div>
		);
	}
}

class UserProfileView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div class="user-profile">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ2wn18dnC8OmX7Qx49epjgoHREUBHEviB10griBGemOmkYQoK5g"
					id="profile-pic"
				/>
				<h3 id="display-name">{this.props.username}</h3>
				<p class="subtitle">{this.props.usertitle}</p>
			</div>
		);
	}
}

class SidebarMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			overview: "active-item",
			schedule: "inactive-item",
			performance: "inactive-item",
			administrator: "inactive-item"
		};
		this.setBtnAndView = this.setBtnAndView.bind(this);
	}

	setBtnAndView(view) {
		this.props.setView(view);
		if (view == "overview") {
			this.setState({
				overview: "active-item",
				schedule: "inactive-item",
				performance: "inactive-item",
				administrator: "inactive-item"
			});
		} else if (view == "schedule") {
			this.setState({
				overview: "inactive-item",
				schedule: "active-item",
				performance: "inactive-item",
				administrator: "inactive-item"
			});
		} else if (view == "performance") {
			this.setState({
				overview: "inactive-item",
				schedule: "inactive-item",
				performance: "active-item",
				administrator: "inactive-item"
			});
		} else if (view == "administrator") {
			this.setState({
				overview: "inactive-item",
				schedule: "inactive-item",
				performance: "inactive-item",
				administrator: "active-item"
			});
		}
	}

	render() {
		return (
			<div class="menu-items">
				<a
					class={this.state.overview}
					href="#"
					onClick={() => this.setBtnAndView("overview")}
				>
					{this.props.item1}
				</a>
				<a
					class={this.state.schedule}
					href="#"
					onClick={() => this.setBtnAndView("schedule")}
				>
					{this.props.item2}
				</a>
				<a
					class={this.state.performance}
					href="#"
					onClick={() => this.setBtnAndView("performance")}
				>
					{this.props.item3}
				</a>
				<a
					class={this.state.administrator}
					href="#"
					onClick={() => this.setBtnAndView("administrator")}
				>
					{this.props.item4}
				</a>
			</div>
		);
	}
}

class Overview extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div class="dash-view">
				<h2 class="view-heading">Here's your PROFILE.</h2>
				<DashboardCard />
			</div>
		);
	}
}

class ScheduleView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div class="dash-view">
				<h2 class="view-heading">Check your schedule.</h2>
				<DashboardCard />
			</div>
		);
	}
}

class PerformanceView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div class="dash-view">
				<h2 class="view-heading">Track your performance.</h2>
				<DashboardCard />
			</div>
		);
	}
}

class AdministratorView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div class="dash-view">
				<h2 class="view-heading">Manage .</h2>
				<DashboardCard />
			</div>
		);
	}
}

class DashboardCard extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		switch(currentView) {
			case "overview":
		return( 
		<div class="dash-card"> 
			<OverviewCardContent />
		</div>);
				case "schedule":
		return( 
		<div class="dash-card"> 
			<ScheduleCardContent />
		</div>);
		case "performance":
		return( 
		<div class="dash-card"> 
			<PerformanceCardContent />
		</div>);
				case "administrator":
		return( 
		<div class="dash-card"> 
			<AdministratorCardContent />
		</div>);
		}
		}
	}

const OverviewCardContent = () => (
	<div>
		<h4 class="card-heading">Your Weekly Outlook</h4>
		<p class="card-subtitle">this is your profile bro.</p>
		<div id="stats-container">
		<div>
			<h5 class="lg-nmbr">NAME:</h5>
			<h5 class="lg-nmbr">ROLL NO:</h5>
			<h5 class="lg-nmbr">REG. NO: </h5>
			<h5 class="lg-nmbr">ENROLLMENT NO:</h5>
			<h5 class="lg-nmbr">DATE OF BIRTH:</h5>
			<h5 class="lg-nmbr">FATHER NAME:</h5>
			<h5 class="lg-nmbr">MOTHER NAME:</h5>
			<h5 class="lg-nmbr">FATHER'S OCCUPATION: </h5>
		</div>
		
		</div>
	</div>
);
const ScheduleCardContent = () => (
	<div>
		<h4 class="card-heading">Your Roster</h4>
		<p class="card-subtitle">Your work schedule for this week.</p>
		
	</div>
);
const PerformanceCardContent = () => (
	<div>
		<h4 class="card-heading">Your Performance</h4>
		<p class="card-subtitle">You need to focus on conversion.</p>
	</div>
);
const AdministratorCardContent = () => (
	<div>
		<h4 class="card-heading">nothing</h4>
	
	</div>
);
export default Dashboard;
//ReactDOM.render(<Dashboard />,
	//document.getElementById("container"));
