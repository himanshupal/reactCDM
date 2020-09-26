import gql from "graphql-tag"

export default gql`
	mutation createTimeTable(
		$className: String!
		$from0: String
		$to0: String
		$subjectId00: ID
		$teacherId00: ID
		$subjectId01: ID
		$teacherId01: ID
		$subjectId02: ID
		$teacherId02: ID
		$subjectId03: ID
		$teacherId03: ID
		$subjectId04: ID
		$teacherId04: ID
		$subjectId05: ID
		$teacherId05: ID
		$from1: String
		$to1: String
		$subjectId10: ID
		$teacherId10: ID
		$subjectId11: ID
		$teacherId11: ID
		$subjectId12: ID
		$teacherId12: ID
		$subjectId13: ID
		$teacherId13: ID
		$subjectId14: ID
		$teacherId14: ID
		$subjectId15: ID
		$teacherId15: ID
		$from2: String
		$to2: String
		$subjectId20: ID
		$teacherId20: ID
		$subjectId21: ID
		$teacherId21: ID
		$subjectId22: ID
		$teacherId22: ID
		$subjectId23: ID
		$teacherId23: ID
		$subjectId24: ID
		$teacherId24: ID
		$subjectId25: ID
		$teacherId25: ID
		$from3: String
		$to3: String
		$subjectId30: ID
		$teacherId30: ID
		$subjectId31: ID
		$teacherId31: ID
		$subjectId32: ID
		$teacherId32: ID
		$subjectId33: ID
		$teacherId33: ID
		$subjectId34: ID
		$teacherId34: ID
		$subjectId35: ID
		$teacherId35: ID
		$from4: String
		$to4: String
		$subjectId40: ID
		$teacherId40: ID
		$subjectId41: ID
		$teacherId41: ID
		$subjectId42: ID
		$teacherId42: ID
		$subjectId43: ID
		$teacherId43: ID
		$subjectId44: ID
		$teacherId44: ID
		$subjectId45: ID
		$teacherId45: ID
		$from5: String
		$to5: String
		$subjectId50: ID
		$teacherId50: ID
		$subjectId51: ID
		$teacherId51: ID
		$subjectId52: ID
		$teacherId52: ID
		$subjectId53: ID
		$teacherId53: ID
		$subjectId54: ID
		$teacherId54: ID
		$subjectId55: ID
		$teacherId55: ID
		$from6: String
		$to6: String
		$subjectId60: ID
		$teacherId60: ID
		$subjectId61: ID
		$teacherId61: ID
		$subjectId62: ID
		$teacherId62: ID
		$subjectId63: ID
		$teacherId63: ID
		$subjectId64: ID
		$teacherId64: ID
		$subjectId65: ID
		$teacherId65: ID
		$from7: String
		$to7: String
		$subjectId70: ID
		$teacherId70: ID
		$subjectId71: ID
		$teacherId71: ID
		$subjectId72: ID
		$teacherId72: ID
		$subjectId73: ID
		$teacherId73: ID
		$subjectId74: ID
		$teacherId74: ID
		$subjectId75: ID
		$teacherId75: ID
		$from8: String
		$to8: String
		$subjectId80: ID
		$teacherId80: ID
		$subjectId81: ID
		$teacherId81: ID
		$subjectId82: ID
		$teacherId82: ID
		$subjectId83: ID
		$teacherId83: ID
		$subjectId84: ID
		$teacherId84: ID
		$subjectId85: ID
		$teacherId85: ID
	) {
		createTimeTable(
			className: $className
			data: [
				{
					from: $from0
					to: $to0
					detail: [
						{ subjectId: $subjectId00, teacherId: $teacherId00 }
						{ subjectId: $subjectId01, teacherId: $teacherId01 }
						{ subjectId: $subjectId02, teacherId: $teacherId02 }
						{ subjectId: $subjectId03, teacherId: $teacherId03 }
						{ subjectId: $subjectId04, teacherId: $teacherId04 }
						{ subjectId: $subjectId05, teacherId: $teacherId05 }
					]
				}
				{
					from: $from1
					to: $to1
					detail: [
						{ subjectId: $subjectId10, teacherId: $teacherId10 }
						{ subjectId: $subjectId11, teacherId: $teacherId11 }
						{ subjectId: $subjectId12, teacherId: $teacherId12 }
						{ subjectId: $subjectId13, teacherId: $teacherId13 }
						{ subjectId: $subjectId14, teacherId: $teacherId14 }
						{ subjectId: $subjectId15, teacherId: $teacherId15 }
					]
				}
				{
					from: $from2
					to: $to2
					detail: [
						{ subjectId: $subjectId20, teacherId: $teacherId20 }
						{ subjectId: $subjectId21, teacherId: $teacherId21 }
						{ subjectId: $subjectId22, teacherId: $teacherId22 }
						{ subjectId: $subjectId23, teacherId: $teacherId23 }
						{ subjectId: $subjectId24, teacherId: $teacherId24 }
						{ subjectId: $subjectId25, teacherId: $teacherId25 }
					]
				}
				{
					from: $from3
					to: $to3
					detail: [
						{ subjectId: $subjectId30, teacherId: $teacherId30 }
						{ subjectId: $subjectId31, teacherId: $teacherId31 }
						{ subjectId: $subjectId32, teacherId: $teacherId32 }
						{ subjectId: $subjectId33, teacherId: $teacherId33 }
						{ subjectId: $subjectId34, teacherId: $teacherId34 }
						{ subjectId: $subjectId35, teacherId: $teacherId35 }
					]
				}
				{
					from: $from4
					to: $to4
					detail: [
						{ subjectId: $subjectId40, teacherId: $teacherId40 }
						{ subjectId: $subjectId41, teacherId: $teacherId41 }
						{ subjectId: $subjectId42, teacherId: $teacherId42 }
						{ subjectId: $subjectId43, teacherId: $teacherId43 }
						{ subjectId: $subjectId44, teacherId: $teacherId44 }
						{ subjectId: $subjectId45, teacherId: $teacherId45 }
					]
				}
				{
					from: $from5
					to: $to5
					detail: [
						{ subjectId: $subjectId50, teacherId: $teacherId50 }
						{ subjectId: $subjectId51, teacherId: $teacherId51 }
						{ subjectId: $subjectId52, teacherId: $teacherId52 }
						{ subjectId: $subjectId53, teacherId: $teacherId53 }
						{ subjectId: $subjectId54, teacherId: $teacherId54 }
						{ subjectId: $subjectId55, teacherId: $teacherId55 }
					]
				}
				{
					from: $from6
					to: $to6
					detail: [
						{ subjectId: $subjectId60, teacherId: $teacherId60 }
						{ subjectId: $subjectId61, teacherId: $teacherId61 }
						{ subjectId: $subjectId62, teacherId: $teacherId62 }
						{ subjectId: $subjectId63, teacherId: $teacherId63 }
						{ subjectId: $subjectId64, teacherId: $teacherId64 }
						{ subjectId: $subjectId65, teacherId: $teacherId65 }
					]
				}
				{
					from: $from7
					to: $to7
					detail: [
						{ subjectId: $subjectId70, teacherId: $teacherId70 }
						{ subjectId: $subjectId71, teacherId: $teacherId71 }
						{ subjectId: $subjectId72, teacherId: $teacherId72 }
						{ subjectId: $subjectId73, teacherId: $teacherId73 }
						{ subjectId: $subjectId74, teacherId: $teacherId74 }
						{ subjectId: $subjectId75, teacherId: $teacherId75 }
					]
				}
				{
					from: $from8
					to: $to8
					detail: [
						{ subjectId: $subjectId80, teacherId: $teacherId80 }
						{ subjectId: $subjectId81, teacherId: $teacherId81 }
						{ subjectId: $subjectId82, teacherId: $teacherId82 }
						{ subjectId: $subjectId83, teacherId: $teacherId83 }
						{ subjectId: $subjectId84, teacherId: $teacherId84 }
						{ subjectId: $subjectId85, teacherId: $teacherId85 }
					]
				}
			]
		)
	}
`
