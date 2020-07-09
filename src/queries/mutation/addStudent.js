import gql from "graphql-tag";

export default gql`
	mutation addStudent(
		$username: String
		$rollNumber: String
		$registrationNumber: String
		$enrollmentNumber: String
		$firstName: String
		$lastName: String
		$fatherName: String
		$fatherOccupation: String
		$fatherAnnualIncome: String
		$fatherContactNumber: String
		$motherName: String
		$motherOccupation: String
		$motherAnnualIncome: String
		$motherContactNumber: String
		$bloodGroup: String
		$gender: String
		$caste: String
		$class: String
		$religion: String
		$dateOfBirth: String
		$aadharNumber: String
		$photo: String
		$email: String
		$contactNumber: String
		$dateOfLeaving: String
		$addressCurrentLocality: String
		$addressCurrentDistrict: String
		$addressCurrentCity: String
		$addressPermanentLocality: String
		$addressPermanentDistrict: String
		$addressPermanentCity: String
	) {
		addStudent(
			data: {
				username: $username
				rollNumber: $rollNumber
				registrationNumber: $registrationNumber
				enrollmentNumber: $enrollmentNumber
				name: { first: $firstName, last: $lastName }
				father: {
					name: $fatherName
					occupation: $fatherOccupation
					annualSalary: $fatherAnnualIncome
					contactNumber: $fatherContactNumber
				}
				mother: {
					name: $motherName
					occupation: $motherOccupation
					annualSalary: $motherAnnualIncome
					contactNumber: $motherContactNumber
				}
				bloodGroup: $bloodGroup
				gender: $gender
				caste: $caste
				class: $class
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
				contactNumber: $contactNumber
				dateOfLeaving: $dateOfLeaving
			}
		)
	}
`;
