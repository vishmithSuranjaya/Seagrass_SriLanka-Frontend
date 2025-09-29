import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer,Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom"; 
import Breadcrumb from "../breadcrumb/BreadCrumb";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate(); 
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/news/api/calendar/events/", { withCredentials: true })
      .then((res) => {
        const mappedEvents = res.data.map((event) => ({
          id: event.news_id,
          title: event.title,
          start: new Date(event.updated_at),
          end: new Date(event.updated_at),
        }));
        setEvents(mappedEvents);
      })
      .catch(() => console.log(" Not logged in or no events"));
  }, []);

  // When user clicks a specific event (title)
  const handleEventClick = (event) => {
    navigate(`/newsdetails/${event.id}`); 
  };



  return (
    <div className="mt-24 px-20">
        <Breadcrumb />
        <button
        onClick={() => navigate(-1)}
        className=" ml-20 mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800 transition-colors"
      >
        ← Back
      </button>
        <div className="p-4">
        
      <h2 className="text-xl font-semibold mt-4">Google Calendar</h2>

      <div className="mt-4" style={{ height: "500px" }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate} 
          onNavigate={(newDate) => setCurrentDate(newDate)} //
          style={{ height: 500 }}
          onSelectEvent={handleEventClick} // click on event title
          selectable
          view={view}               
          onView={(newView) => setView(newView)}
        />
      </div>
    </div>
    </div>
  );
};

export default Calendar;
