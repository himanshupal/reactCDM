import gql from "graphql-tag"

export default gql`
	mutation addSubjects(
		$class: String!
		$name0: String
		$language0: String
		$subjectCode0: String
		$uniSubjectCode0: String
		$teacher0: ID
		$name1: String
		$language1: String
		$subjectCode1: String
		$uniSubjectCode1: String
		$teacher1: ID
		$name2: String
		$language2: String
		$subjectCode2: String
		$uniSubjectCode2: String
		$teacher2: ID
		$name3: String
		$language3: String
		$subjectCode3: String
		$uniSubjectCode3: String
		$teacher3: ID
		$name4: String
		$language4: String
		$subjectCode4: String
		$uniSubjectCode4: String
		$teacher4: ID
		$name5: String
		$language5: String
		$subjectCode5: String
		$uniSubjectCode5: String
		$teacher5: ID
		$name6: String
		$language6: String
		$subjectCode6: String
		$uniSubjectCode6: String
		$teacher6: ID
		$name7: String
		$language7: String
		$subjectCode7: String
		$uniSubjectCode7: String
		$teacher7: ID
		$name8: String
		$language8: String
		$subjectCode8: String
		$uniSubjectCode8: String
		$teacher8: ID
		$name9: String
		$language9: String
		$subjectCode9: String
		$uniSubjectCode9: String
		$teacher9: ID
	) {
		addSubjects(
			class: $class
			data: [
				{
					name: $name0
					language: $language0
					subjectCode: $subjectCode0
					uniSubjectCode: $uniSubjectCode0
					teacher: $teacher0
				}
				{
					name: $name1
					language: $language1
					subjectCode: $subjectCode1
					uniSubjectCode: $uniSubjectCode1
					teacher: $teacher1
				}
				{
					name: $name2
					language: $language2
					subjectCode: $subjectCode2
					uniSubjectCode: $uniSubjectCode2
					teacher: $teacher2
				}
				{
					name: $name3
					language: $language3
					subjectCode: $subjectCode3
					uniSubjectCode: $uniSubjectCode3
					teacher: $teacher3
				}
				{
					name: $name4
					language: $language4
					subjectCode: $subjectCode4
					uniSubjectCode: $uniSubjectCode4
					teacher: $teacher4
				}
				{
					name: $name5
					language: $language5
					subjectCode: $subjectCode5
					uniSubjectCode: $uniSubjectCode5
					teacher: $teacher5
				}
				{
					name: $name6
					language: $language6
					subjectCode: $subjectCode6
					uniSubjectCode: $uniSubjectCode6
					teacher: $teacher6
				}
				{
					name: $name7
					language: $language7
					subjectCode: $subjectCode7
					uniSubjectCode: $uniSubjectCode7
					teacher: $teacher7
				}
				{
					name: $name8
					language: $language8
					subjectCode: $subjectCode8
					uniSubjectCode: $uniSubjectCode8
					teacher: $teacher8
				}
				{
					name: $name9
					language: $language9
					subjectCode: $subjectCode9
					uniSubjectCode: $uniSubjectCode9
					teacher: $teacher9
				}
			]
		) {
			_id
			name
			language
			subjectCode
			uniSubjectCode
			teacher {
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
