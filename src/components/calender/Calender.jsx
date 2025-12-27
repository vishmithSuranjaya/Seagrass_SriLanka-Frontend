import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom"; 
import Breadcrumb from "../breadcrumb/BreadCrumb";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH); 
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/news/api/calendar/events/", { withCredentials: true })
      .then((res) => {
        const mappedEvents = res.data.map((event) => ({
          id: event.news_id,
          title: event.title,
          start: new Date(event.created_at),
          end: new Date(event.created_at),
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
        <div className="p-4">
        
      <h2 className="text-xl font-semibold mt-4">Google Calendar</h2>

      <div className="mt-4" style={{ height: "500px" }}>
        <BigCalendar
          view={view}               
          onView={(newView) => setView(newView)}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate} 
          onNavigate={(newDate) => setCurrentDate(newDate)} //
          style={{ height: 500 }}
          onSelectEvent={handleEventClick} // click on event title
          selectable
        />
      </div>
    </div>
    </div>
  );
};

export default Calendar;
