import React, { useState } from 'react';
import WeatherApp from './components/WeatherApp';
import './styles.css';
import { Button } from 'react-bootstrap';

function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <div>

      {isDarkTheme ? (
        <Button onClick={toggleTheme} variant="light" className='rounded float-end'>
          <i className="bi bi-moon"></i>
        </Button>
      ) : (
        <Button onClick={toggleTheme} variant="light" className='rounded float-end'>
          <i className="bi bi-sun"></i>
        </Button>
      )}

      <div
        className={isDarkTheme ? 'dark-theme' : 'light-theme'}>

        <WeatherApp />
      </div>
    </div>
  )

}


export default App;
