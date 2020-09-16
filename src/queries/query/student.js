import gql from "graphql-tag"

export default gql`
	query student($username: String!) {
		student(username: $username) {
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
		}
	}
`
