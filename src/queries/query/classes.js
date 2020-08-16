import gql from "graphql-tag"

export default gql`
	query classes($course: ID!) {
		classes(course: $course) {
			_id
			name
		}
	}
`
