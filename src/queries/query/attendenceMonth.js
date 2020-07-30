import gql from "graphql-tag";

export default gql`
	query attendenceMonth($cid: ID, $month: Int, $year: Int) {
		attendenceMonth(cid: $cid, month: $month, year: $year) {
			holiday
			day
			totalStudents
			students
		}
		students {
			_id
			name {
				first
				last
			}
			class {
				_id
			}
		}
	}
`;
