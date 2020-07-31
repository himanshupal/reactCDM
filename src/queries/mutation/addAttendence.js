import gql from "graphql-tag";

export default gql`
	mutation addAttendence($day: String, $class: String, $holiday: String, $students: [String]) {
		addAttendence(data: { day: $day, class: $class, holiday: $holiday, students: $students })
	}
`;
