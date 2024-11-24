import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";

function MyCalendar() {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (date) => {
        // Calendar에서 날짜 선택 시 호출되는 함수
        const formattedDate = moment(date).format("YYYY-MM-DD"); // 날짜 포맷팅
        setDate(formattedDate);
      };

      return (
        <div className="calendar-container">
        <Calendar
        onChange={handleDateChange}
        value={date}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
      ></Calendar>
      </div>
      );
}

export default MyCalendar;