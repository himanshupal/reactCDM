import gql from "graphql-tag";

export default gql`
	query teachers($department: ID) {
		teachers(department: $department) {
			_id
			username
			designation
			name {
				first
				last
			}
			bloodGroup
			gender
			caste
			religion
			dateOfBirth
			contactNumber
			photo
			email
			teaches {
				_id
				name
			}
			classTeacherOf {
				_id
				name
			}
		}
	}
`;
