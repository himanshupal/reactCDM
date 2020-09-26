import gql from "graphql-tag"

export default gql`
	mutation attendenceMonth(
		$class: ID
		$day0: String
		$day1: String
		$day2: String
		$day3: String
		$day4: String
		$day5: String
		$day6: String
		$day7: String
		$day8: String
		$day9: String
		$day10: String
		$day11: String
		$day12: String
		$day13: String
		$day14: String
		$day15: String
		$day16: String
		$day17: String
		$day18: String
		$day19: String
		$day20: String
		$day21: String
		$day22: String
		$day23: String
		$day24: String
		$day25: String
		$day26: String
		$day27: String
		$day28: String
		$day29: String
		$day30: String
		$students0: [ID]
		$students1: [ID]
		$students2: [ID]
		$students3: [ID]
		$students4: [ID]
		$students5: [ID]
		$students6: [ID]
		$students7: [ID]
		$students8: [ID]
		$students9: [ID]
		$students10: [ID]
		$students11: [ID]
		$students12: [ID]
		$students13: [ID]
		$students14: [ID]
		$students15: [ID]
		$students16: [ID]
		$students17: [ID]
		$students18: [ID]
		$students19: [ID]
		$students20: [ID]
		$students21: [ID]
		$students22: [ID]
		$students23: [ID]
		$students24: [ID]
		$students25: [ID]
		$students26: [ID]
		$students27: [ID]
		$students28: [ID]
		$students29: [ID]
		$students30: [ID]
		$holiday0: String
		$holiday1: String
		$holiday2: String
		$holiday3: String
		$holiday4: String
		$holiday5: String
		$holiday6: String
		$holiday7: String
		$holiday8: String
		$holiday9: String
		$holiday10: String
		$holiday11: String
		$holiday12: String
		$holiday13: String
		$holiday14: String
		$holiday15: String
		$holiday16: String
		$holiday17: String
		$holiday18: String
		$holiday19: String
		$holiday20: String
		$holiday21: String
		$holiday22: String
		$holiday23: String
		$holiday24: String
		$holiday25: String
		$holiday26: String
		$holiday27: String
		$holiday28: String
		$holiday29: String
		$holiday30: String
	) {
		attendenceMonth(
			class: $class
			data: [
				{ day: $day0, students: $students0, holiday: $holiday0 }
				{ day: $day1, students: $students1, holiday: $holiday1 }
				{ day: $day2, students: $students2, holiday: $holiday2 }
				{ day: $day3, students: $students3, holiday: $holiday3 }
				{ day: $day4, students: $students4, holiday: $holiday4 }
				{ day: $day5, students: $students5, holiday: $holiday5 }
				{ day: $day6, students: $students6, holiday: $holiday6 }
				{ day: $day7, students: $students7, holiday: $holiday7 }
				{ day: $day8, students: $students8, holiday: $holiday8 }
				{ day: $day9, students: $students9, holiday: $holiday9 }
				{ day: $day10, students: $students10, holiday: $holiday10 }
				{ day: $day11, students: $students11, holiday: $holiday11 }
				{ day: $day12, students: $students12, holiday: $holiday12 }
				{ day: $day13, students: $students13, holiday: $holiday13 }
				{ day: $day14, students: $students14, holiday: $holiday14 }
				{ day: $day15, students: $students15, holiday: $holiday15 }
				{ day: $day16, students: $students16, holiday: $holiday16 }
				{ day: $day17, students: $students17, holiday: $holiday17 }
				{ day: $day18, students: $students18, holiday: $holiday18 }
				{ day: $day19, students: $students19, holiday: $holiday19 }
				{ day: $day20, students: $students20, holiday: $holiday20 }
				{ day: $day21, students: $students21, holiday: $holiday21 }
				{ day: $day22, students: $students22, holiday: $holiday22 }
				{ day: $day23, students: $students23, holiday: $holiday23 }
				{ day: $day24, students: $students24, holiday: $holiday24 }
				{ day: $day25, students: $students25, holiday: $holiday25 }
				{ day: $day26, students: $students26, holiday: $holiday26 }
				{ day: $day27, students: $students27, holiday: $holiday27 }
				{ day: $day28, students: $students28, holiday: $holiday28 }
				{ day: $day29, students: $students29, holiday: $holiday29 }
				{ day: $day30, students: $students30, holiday: $holiday30 }
			]
		) {
			_id
			day
			holiday
			students {
				_id
			}
		}
	}
`
