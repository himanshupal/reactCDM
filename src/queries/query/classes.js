import gql from "graphql-tag"

export default gql`
	query classes($course: ID!) {
		classes(course: $course) {
			_id
			name
			sessionStart
			sessionEnd
			totalStudents
			classTeacher {
				_id
				username
				name {
					first
					last
				}
			}
			createdAt
			createdBy {
				_id
				username
				name {
					first
					last
				}
			}
			updatedAt
			updatedBy {
				_id
				username
				name {
					first
					last
				}
			}
		}
	}
`
