import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import {
  setSearchHistory,
  addSearchHistoryItem,
  deleteSearchHistoryItem,
  setWeatherData
} from '../redux/actions';
import Select from 'react-select';

import citiesJson from '../assets/json/cities.json';
import AlertComponent from './AlertComponent';
import { getWeatherData } from '../services/api';

const WeatherApp = () => {
  const [cityObj, setCityObj] = useState('');
  const weatherData = useSelector((state) => state.weatherData);
  const timestamp = useSelector(state => state.timestamp);
  const isDarkTheme = 'light';

  const searchHistory = useSelector((state) => state.searchHistory);
  const dispatch = useDispatch();

  const [alert, setAlert] = useState(null);

  const showAlert = (variant, message) => {
    setAlert({ variant, message });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const citiesList = citiesJson.map((cityObj) => ({
    value: cityObj.city,
    label: `${cityObj.city}, ${cityObj.country}`,
  }));

  const convertToCelcius = (temp) => {
    return Math.round((temp - 273.15) * 10) / 10;
  }

  const colourStyles = () => {
    return {
      control: (styles) => ({
        ...styles, backgroundColor: isDarkTheme === 'light'
          ? '#d4b8ec'
          : '#382d6a', border: 'none'
      }),
      option: (styles) => {
        return {
          ...styles,
          backgroundColor: isDarkTheme === 'light'
            ? '#d4b8ec'
            : '#382d6a',
          color: isDarkTheme === 'light'
            ? '#7f7f7f'
            : 'white',
        };
      },
      input: (styles) => ({
        ...styles, color: isDarkTheme === 'light'
          ? '#7f7f7f'
          : 'white'
      }),
      placeholder: (styles) => ({
        ...styles, color: isDarkTheme === 'light'
          ? '#7f7f7f'
          : 'white'
      }),
      singleValue: (styles) => ({
        ...styles, color: isDarkTheme === 'light'
          ? '#7f7f7f'
          : 'white'
      }),
    }
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    dispatch(setSearchHistory(storedHistory));
  }, [dispatch]);

  const searchWeather = async () => {
    try {
      const city = cityObj.value;
      const response = await getWeatherData(city);
      const newWeatherData = response;

      const newSearchHistory = [...searchHistory, {
        city: newWeatherData.name,
        country: newWeatherData.sys.country,
        timestamp: new Date().toLocaleString()
      }];
      localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));

      dispatch(setWeatherData(newWeatherData));

      dispatch(addSearchHistoryItem(
        {
          city: newWeatherData.name,
          country: newWeatherData.sys.country,
          timestamp: new Date().toLocaleString()
        }
      ));

    } catch (error) {
      showAlert('danger', error.message);
    }
  };

  const searchExistingWeather = async (city) => {
    try {
      console.log(city);
      const response = await getWeatherData(city);
      const newWeatherData = response;

      const newSearchHistory = [...searchHistory, {
        city: newWeatherData.name,
        country: newWeatherData.sys.country,
        timestamp: new Date().toLocaleString()
      }];
      localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));

      dispatch(setWeatherData(newWeatherData));

      dispatch(addSearchHistoryItem(
        {
          city: newWeatherData.name,
          country: newWeatherData.sys.country,
          timestamp: new Date().toLocaleString()
        }
      ));

    } catch (error) {
      showAlert('danger', error.message);
    }
  };

  const handleDeleteRecord = (index) => {
    dispatch((dispatch, getState) => {
      dispatch(deleteSearchHistoryItem(index));
      const currentSearchHistory = getState().searchHistory;
      const updatedSearchHistory = [...currentSearchHistory] ?? [];
      localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));
    });
  };


  return (
    <Container className="weather-container" fluid={true}>
      {alert && <AlertComponent variant={alert.variant} message={alert.message} />}

      <Form className='form-style px-3'>
        <Row>
          <Col xs={11}>
            <Form.Group controlId="formCity">
              <Select
                placeholder="City"
                defaultValue={cityObj}
                value={cityObj}
                onChange={setCityObj}
                options={citiesList}
                styles={colourStyles(isDarkTheme ? 'dark' : 'light')}
              />
            </Form.Group>
          </Col>
          <Col xs={1}>
            <Button variant="outline-light" className='search-icon float-end' onClick={searchWeather}>
              <i className="bi bi-search"></i>
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className='px-3'>
        <Col>
          {weatherData && weatherData.weather && (
            <div className='position-relative'>
              <img
                src={(() => {
                  try {
                    return require(`../assets/images/${weatherData.weather[0].main}.png`);
                  } catch (error) {
                    return require('../assets/images/default.png');
                  }
                })()}
                alt="images"
                className='weather-img'
              />
              <Row>
                <Col>
                  <span>Today's Weather</span>
                </Col>
              </Row>

              <Row>
                <Col>
                  <h1>{`${convertToCelcius(weatherData.main.temp)}°C`}</h1>
                </Col>
              </Row>

              <Row>
                <Col>
                  <span>{`H: ${convertToCelcius(weatherData.main.temp_max)}°C`}</span>
                  <span>{`L: ${convertToCelcius(weatherData.main.temp_min)}°C`}</span>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p className='font-weight-bold'>{`${weatherData.name}, ${weatherData.sys.country}`}</p>
                </Col>

                <Col>
                  <span>{`${timestamp}`}</span>
                </Col>

                <Col>
                  <span>{`Humidity: ${weatherData.main.humidity}%`}</span>
                </Col>

                <Col className='text-center'>
                  <span>{weatherData.weather[0].main}</span>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      <Row className='rounded search-container px-3 mx-3'>
        <Col>
          <div className='my-3'><span>Search History</span></div>
          <ListGroup>
            {searchHistory.map((record, index) => (
              <ListGroup.Item key={index} className='rounded mb-3 search-bar'>
                {`${record.city}, ${record.country}`}

                <ButtonGroup className='float-end search-bar-secondary-info'>
                  <span className='me-2'> {`${record.timestamp}`}</span>

                  <Button size="sm" variant="outline-light" className="rounded-circle me-2 border" onClick={() => searchExistingWeather(record.city)}>
                    <i className="bi bi-search icon-color"></i>
                  </Button>

                  <Button size="sm" variant="outline-light" className="rounded-circle border" onClick={() => handleDeleteRecord(index)}>
                    <i className="bi bi-trash icon-color"></i>
                  </Button>
                </ButtonGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherApp;
