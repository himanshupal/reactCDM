import React from "react";
import CalendarTab from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DateInput } from "semantic-ui-calendar-react";

const Calendar = () => {
	return (
		<>
			<CalendarTab tileContent={({ date, view }) => (view === "month" && date.getDay() === 0 ? <p>Sunday</p> : null)} />
			<DateInput inline popupPosition="bottom center" />
		</>
	);
};

export default Calendar;
