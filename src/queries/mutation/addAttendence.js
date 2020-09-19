import gql from "graphql-tag"

export default gql`
	mutation addAttendence($class: ID, $holiday: String, $students: [ID]) {
		addAttendence(class: $class, data: { holiday: $holiday, students: $students })
	}
`
