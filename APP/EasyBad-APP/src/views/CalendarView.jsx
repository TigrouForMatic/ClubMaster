import { useState, useEffect } from "react";
import axios from "axios";
import {dateFormat} from "../js/date";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import Select from 'react-select';

export const data = [
    [
      { type: "date", id: "Date" },
      { type: "number", id: "Won/Loss" },
    ],
    [new Date(2013, 2, 4), 10],
    [new Date(2013, 2, 5), 3],
    [new Date(2013, 2, 7), -1],
    [new Date(2013, 2, 8), 2],
    [new Date(2013, 2, 12), -1],
    [new Date(2013, 2, 13), 1],
    [new Date(2013, 2, 15), 1],
    [new Date(2013, 2, 16), -4],
    [new Date(2013, 1, 4), 10],
    [new Date(2013, 1, 5), 3],
    [new Date(2013, 1, 7), -1],
    [new Date(2013, 1, 8), 2],
    [new Date(2013, 1, 12), -1],
    [new Date(2013, 1, 13), 1],
    [new Date(2013, 1, 15), 1],
    [new Date(2013, 1, 16), -4],
  ];
  
  export const options = {
    title: "Calendrier du club",
  };

  const colourOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

function CalendarView() {
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
    
    const getDateDisplay = (date) => {
        return dateFormat(date);
    }

    const getDataForSelectFromTypeEvent = () => {
        let selectOptions = [{
            value : O,
            label : "Tous"
        }];
        if(typeEvent) {
            
            for(let type of typeEvent) {
                let typeObj = {
                    value : type.id,
                    label : type.label
                }
                selectOptions.push(typeObj);
            }
        }
        return selectOptions;
    }

    const getDataForCalendarFromEvents = () => {
        
    }

    return (
        <div>
            <h1>CalendarView</h1>

            {/* <h2>Types d'evenement :</h2>
            <ul>
                {typeEvent.map((type) => (
                    <li key={type.id}>
                        <p>Nom : {type.label}</p>
                    </li>
                ))}
            </ul>

            <h2>Evenement :</h2>
            <ul>
                {event.map((event) => (
                    <li key={event.id}>
                        <p>Nom : {event.label}</p>
                        <p>Description : {event.description}</p>
                        <p>Date de debut : {getDateDisplay(event.dd)}</p>
                        <p>Date de fin : {getDateDisplay(event.df)}</p>
                    </li>
                ))}
            </ul> */}

            <div>
                <h3>Type d'evenement</h3>
                <Select
                    defaultValue={[getDataForSelectFromTypeEvent[0]]}
                    isMulti
                    name="colors"
                    options={getDataForSelectFromTypeEvent}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            </div>
            
            <div>
                <h3>Période</h3>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>

            <Chart
                chartType="Calendar"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </div>
    );
}

export default CalendarView;
