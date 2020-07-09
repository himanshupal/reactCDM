import gql from "graphql-tag";

export default gql`
	mutation addTeacher(
		$username: String
		$designation: String
		$registrationNumber: String
		$firstName: String
		$lastName: String
		$fatherName: String
		$fatherOccupation: String
		$fatherAnnualIncome: String
		$alternativeContact: String
		$bloodGroup: String
		$gender: String
		$caste: String
		$religion: String
		$dateOfBirth: String
		$aadharNumber: String
		$photo: String
		$email: String
		$major: String
		$contactNumber: String
		$dateOfJoining: String
		$addressCurrentLocality: String
		$addressCurrentDistrict: String
		$addressCurrentCity: String
		$addressPermanentLocality: String
		$addressPermanentDistrict: String
		$addressPermanentCity: String
	) {
		addTeacher(
			data: {
				username: $username
				designation: $designation
				registrationNumber: $registrationNumber
				name: { first: $firstName, last: $lastName }
				father: {
					name: $fatherName
					occupation: $fatherOccupation
					annualSalary: $fatherAnnualIncome
					contactNumber: $alternativeContact
				}
				bloodGroup: $bloodGroup
				gender: $gender
				caste: $caste
				religion: $religion
				dateOfBirth: $dateOfBirth
				address: {
					current: {
						locality: $addressCurrentLocality
						district: $addressCurrentDistrict
						city: $addressCurrentCity
					}
					permanent: {
						locality: $addressPermanentLocality
						district: $addressPermanentDistrict
						city: $addressPermanentCity
					}
				}
				aadharNumber: $aadharNumber
				photo: $photo
				email: $email
				major: $major
				contactNumber: $contactNumber
				dateOfJoining: $dateOfJoining
			}
		)
	}
`;
