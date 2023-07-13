import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart } from "react-google-charts";
import Cookie from 'js-cookie';

function Weather() {

    const [searchTerm, setSearchTerm] = useState("");
    const [countries, setCountries] = useState(null);
    const [countryAndCity, setCountryAndCity] = useState(null);
    const [lon, setLon] = useState(null)
    const [lat, setLat] = useState(null)
    const [weather, setWeather] = useState(null)
    const [chartData, setChartData] = useState(null)

    const options = {
        curveType: "function",
        legend: { position: "bottom" },
        backgroundColor: '#F9FAFC',
    };

    const handleChange = e => {
        e.preventDefault()
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/capital')
        .then(response => response.json())
        .then(res => {
            setCountries(res.data.filter(country => country.capital != ""))  
        })
    }, [])

    const handleBtnClick = e => {
        let string = e.target.innerText
        let city = string.slice(0, string.indexOf(","))
        setCountryAndCity(string)
        setSearchTerm(string);
        
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=API_KEY`)
        .then(res => res.json())
        .then(res => {
            setLon(res[0].lon)
            setLat(res[0].lat)
        })
    }

    useEffect(() => {
        (lon !== null && lat !== null)  && 
            fetch(`http://api.weatherapi.com/v1/forecast.json?key=API_KEY&q=${lat},${lon}&days=5&aqi=no&alerts=no
            `)
            .then(res => res.json())
            .then(res => {
                setWeather(res)
            }
        )
    }, [lon, lat])

    useEffect(() => {
        let newData = [["Day", "Min", "Max"]]
        weather && weather.forecast.forecastday.map((day, i) => {
            newData.push([day.date.slice(5), day.day.mintemp_c, day.day.maxtemp_c,])
        })
        weather && setChartData(newData)

        weather && fetch('/api/weatherlog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': Cookie.get('XSRF-TOKEN')
            },
            body: JSON.stringify({
                city: countryAndCity,
                weatherlog: newData
            })
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }, [weather])

    return (

        <div className="container-fluid p-0">

            <header className="text-center p-3 bg-dark text-light border-bottom border-2 border-light">
                <h1 className="fw-bold" style={{'letterSpacing': '2px'}}>Weather App</h1>
            </header>

            <main className="container-fluid mb-5">
                <div className="row justify-content-center pt-5">
                    <div className="col-10 col-md-6 p-0">
                        
                        <div className="input-group mb-3 dropdown" data-bs-toggle="dropdown">
                            <input type="text" className="form-control" placeholder="Choose a city" aria-label="Choose a city" aria-describedby="cities" value={searchTerm} onChange={e => handleChange(e)} />
                            <button className="btn bg-white dropdown-toggle" type="button"></button>

                            {countries != null &&
                            <ul className="dropdown-menu w-100">

                                {countries.filter(country => country.capital.toLowerCase().startsWith(searchTerm.toLowerCase())).length > 0 
                                    ?
                                    (countries.filter(country => country.capital.toLowerCase().startsWith(searchTerm.toLowerCase()))
                                    .map((country, index) => {
                                        return ( 
                                            <li key={index}>
                                                <button className="dropdown-item" type="button" onClick={e => handleBtnClick(e)}>{country.capital}, {country.name}</button>
                                            </li>
                                        )
                                    })) 
                                    : 
                                    (<li className="ps-3 pt-1 pb-1">No more options.</li>)
                                }
                            </ul>}
                        </div>
                    </div>

                    {weather && 
                        <div>
                            <div className="row justify-content-center p-0 mt-5 mb-5">
                                <div className='card col-10 col-md-6 p-0'>
                                    <div className="card-header p-0">
                                        <h5 className="ps-3 pe-3 pt-2 d-flex align-items-center justify-content-between">{countryAndCity} <img src={weather.current.condition.icon} width="50px"/></h5>
                                    </div>
                                    <div className="card-body p-3" >
                                        <div className="d-flex justify-content-between"> <span>Temperature: { weather.current.temp_c }&#x2103;</span>
                                        <span>Feels like: {weather.current.feelslike_c}&#x2103;</span>
                                        </div>
                                        <div className="text-muted mt-2">{weather.current.condition.text}</div>
                                        <div className="text-muted mt-2">Wind: {weather.current.wind_kph}km/h</div>
                                    </div>
                                </div>
                            </div>

                            <div className="row justify-content-center p-0 mb-5">
                                <div className='card col-10 col-md-6 p-0 pb-5'>
                                    <div className="card-header w-100">
                                        Temperature chart for the next 5 days
                                    </div>
                                    <Chart
                                        chartType="ScatterChart"
                                        width="100%"
                                        height="400px"
                                        data={chartData}
                                        options={options}
                                    />
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className='card col-10 col-md-6 p-0'>
                                <div className="card-header w-100">
                                    Weather forecast for the next 5 days
                                </div>
                                <div className="card-body">
                                {weather.forecast.forecastday.map((day, i) => {
                                    return (
                                    <div className="border-bottom pb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{day.date}</span>
                                            <img src={day.day.condition.icon} />
                                        </div>
                                        <div>
                                            <span className="d-inline-block me-5">{day.day.condition.text}</span>
                                            <span className="d-inline-block me-5">max: {day.day.maxtemp_c}&#x2103;</span>
                                            <span className="d-inline-block">min: {day.day.mintemp_c}&#x2103;</span>
                                        </div>
                                    </div>)
                                })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </main>
        </div>
    );
}

export default Weather;

if (document.getElementById('root')) {
    ReactDOM.render(<Weather />, document.getElementById('root'));
}
