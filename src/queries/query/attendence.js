import gql from "graphql-tag"

export default gql`
	query attendence($class: ID, $month: Int, $year: Int) {
		attendence(class: $class, month: $month, year: $year) {
			_id
			day
			holiday
			totalStudents
			students {
				_id
			}
		}
		students(class: $class) {
			_id
			username
			name {
				first
				last
			}
		}
	}
`
