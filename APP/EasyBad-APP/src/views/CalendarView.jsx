import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { dateFormat } from "../js/date";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import Select from 'react-select';

export const options = {
    title: "Calendrier du club",
};

const CalendarView = () => {
    const [typeEvent, setTypeEvent] = useState([]);
    const [event, setEvent] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: typeEventData }, { data: eventData }] = await Promise.all([
                    axios.get("http://localhost:3200/eventType?clubid=1"),
                    axios.get("http://localhost:3200/event"),
                ]);

                setTypeEvent(typeEventData);

                const eventsDuClub = eventData.filter(event =>
                    typeEventData.some(type => event.eventtypeid === type.id)
                );

                setEvent(eventsDuClub);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
    }, []);

    const getDateDisplay = date => dateFormat(date);

    const getDataForSelectFromTypeEvent = useMemo(() => {
        const selectOptions = [{
            value: 0,
            label: "Tous"
        }];

        if (typeEvent) {
            typeEvent.forEach(type => {
                selectOptions.push({
                    value: type.id,
                    label: type.label
                });
            });
        }
        
        return selectOptions;
    }, [typeEvent]);

    const getDataForCalendarFromEvents = useMemo(() => {
        const eventOptions = [
            [
                { type: "date", id: "Date" },
                { type: "number", id: "Type" },
            ]
        ];

        if (event) {
            event.forEach(evnt => {
                eventOptions.push([new Date(evnt.dd), evnt.eventtypeid]);
            });
        }

        return eventOptions;
    }, [event]);

    return (
        <div>
            <h1>CalendarView</h1>

            <div>
                <h3>Type d'evenement</h3>
                <Select
                    defaultValue={getDataForSelectFromTypeEvent[1]}
                    isMulti
                    name="types"
                    options={getDataForSelectFromTypeEvent}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            </div>

            <div>
                <h3>Période</h3>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </div>

            <div>
                <Chart
                    chartType="Calendar"
                    width="100%"
                    height="400px"
                    data={getDataForCalendarFromEvents}
                    options={options}
                />
            </div>

        </div>
    );
};

export default CalendarView;
