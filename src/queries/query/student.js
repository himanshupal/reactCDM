import gql from "graphql-tag"

export default gql`
	query students($sid: ID) {
		students(sid: $sid) {
			_id
			username
			rollNumber
			registrationNumber
			enrollmentNumber
			name {
				first
				last
			}
			mother {
				name
				occupation
				annualSalary
				contactNumber
			}
			father {
				name
				occupation
				annualSalary
				contactNumber
			}
			class {
				_id
				name
			}
			bloodGroup
			gender
			caste
			religion
			dateOfBirth
			address {
				current {
					locality
					district
					tehsil
				}
				permanent {
					locality
					district
					tehsil
				}
			}
			email
			aadharNumber
			contactNumber
			createdAt
			updatedAt
		}
	}
`
