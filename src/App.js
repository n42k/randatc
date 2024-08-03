import { useState, useEffect } from 'react';
import './App.css';

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours === 0 && minutes === 0) {
    return `${remainingSeconds}s`;
  }

  if (hours === 0) {
    return `${minutes}m${remainingSeconds}s`;
  }

  return `${hours}h${minutes}m${remainingSeconds}s`;
}

function makeNewValue({oldValue, minimum, maximum, minChange, maxChange, roundTo}) {
  console.log({oldValue, minimum, maximum, minChange, maxChange, roundTo});
  let newValue = oldValue;
  while (Math.abs(newValue - oldValue) < minChange
    || newValue < minimum
    || newValue > maximum
  ) {
    newValue = Math.round(oldValue + (Math.random() * (maxChange * 2)) - maxChange);
    console.log(newValue);
  }
  return Math.round(newValue / roundTo) * roundTo;
}

function calculateNextTime({level, headingDiff, airspeedDiff, altitudeDiff}) {
  // Cessna 172 max for each variable:
  // - Heading: 360°
  // - Airspeed: 158kn (vne)
  // - Altitude: 15000ft
  // Cessna 172 max rate of change for each variable:
  // - Heading: 3° per second
  // - Airspeed: 1kn per second
  // - Altitude: 12.2ft per second
  const headingSeconds = headingDiff / 3;
  const airspeedSeconds = airspeedDiff;
  const altitudeSeconds = altitudeDiff / 12.2;

  if (level < 10) {
    // do 400% of the max rate of change for each variable
    return 4 * Math.round(headingSeconds + airspeedSeconds + altitudeSeconds);
  }

  if (level < 20) {
    // do 200% of the max rate of change for each variable
    return 2 * Math.round(headingSeconds + airspeedSeconds + altitudeSeconds);
  }

  if (level < 30) {
    // do 150% of the max rate of change for each variable
    return Math.round(1.5 * Math.round(headingSeconds + airspeedSeconds + altitudeSeconds));
  }

  // do 100% of the max rate of change for each variable
  return Math.round(headingSeconds + airspeedSeconds + altitudeSeconds);
}

const minAltitude = 2000;
const maxAltitude = 15000;
const minHeading = -9999999999;
const maxHeading = 9999999999;
const minAirspeed = 100;
const maxAirspeed = 158;
const roundToAltitude = 100;
const roundToHeading = 10;
const roundToAirspeed = 5;

const getNewAltitude = ({ oldAltitude, minChange, maxChange }) => {
  return makeNewValue({
    oldValue: oldAltitude,
    minimum: minAltitude,
    maximum: maxAltitude,
    minChange,
    maxChange,
    roundTo: roundToAltitude,
  });
};

const getNewHeading = ({ oldHeading, minChange, maxChange }) => {
  return makeNewValue({
    oldValue: oldHeading,
    minimum: minHeading,
    maximum: maxHeading,
    minChange,
    maxChange,
    roundTo: roundToHeading,
  });
};

const getNewAirspeed = ({ oldAirspeed, minChange, maxChange }) => {
  return makeNewValue({
    oldValue: oldAirspeed,
    minimum: minAirspeed,
    maximum: maxAirspeed,
    minChange,
    maxChange,
    roundTo: roundToAirspeed,
  });
};

function App() {
  const [{heading, airspeed, altitude}, setTarget] = useState({
    heading: 180,
    airspeed: 110,
    altitude: 2000,
  });
  const [timeToNextChange, setTimeToNextChange] = useState(null);
  const [level, setLevel] = useState(null);

  const advanceLevel = () => {
    setLevel(oldLevel => {
      const newLevel = oldLevel === null ? 1 : oldLevel + 1;
      if (newLevel === 1) {
        // Level 1
        setTarget({
          heading: 180,
          airspeed: 110,
          altitude: 2000,
        });
        setTimeToNextChange(180);
        return 1;
      }

      if (newLevel < 10) {
        setTarget(({
          heading: oldHeading,
          airspeed: oldAirspeed,
          altitude: oldAltitude,
        }) => {
          const newAltitude = getNewAltitude({ oldAltitude, minChange: 500, maxChange: 1000 });
          const newHeading = getNewHeading({ oldHeading, minChange: 10, maxChange: 20 });
          const newAirspeed = getNewAirspeed({ oldAirspeed, minChange: 5, maxChange: 10 });

          setTimeToNextChange(() => {
            return calculateNextTime({
              level: newLevel,
              headingDiff: Math.abs(newHeading - oldHeading),
              airspeedDiff: Math.abs(newAirspeed - oldAirspeed),
              altitudeDiff: Math.abs(newAltitude - oldAltitude),
            });
          });
  
          return {
            heading: newHeading,
            airspeed: newAirspeed,
            altitude: newAltitude,
          };
        })
        return newLevel;
      }; // end if (newLevel < 10)

      if (newLevel < 20) {
        setTarget(({
          heading: oldHeading,
          airspeed: oldAirspeed,
          altitude: oldAltitude,
        }) => {
          const newAltitude = getNewAltitude({ oldAltitude, minChange: 1000, maxChange: 2000 });
          const newHeading = getNewHeading({ oldHeading, minChange: 20, maxChange: 40 });
          const newAirspeed = getNewAirspeed({ oldAirspeed, minChange: 10, maxChange: 20 });

          setTimeToNextChange(() => {
            return calculateNextTime({
              level: newLevel,
              headingDiff: Math.abs(newHeading - oldHeading),
              airspeedDiff: Math.abs(newAirspeed - oldAirspeed),
              altitudeDiff: Math.abs(newAltitude - oldAltitude),
            });
          });
  
          return {
            heading: newHeading,
            airspeed: newAirspeed,
            altitude: newAltitude,
          };
        })
        return newLevel;
      }; // end if (newLevel < 20)

      if (newLevel < 30) {
        setTarget(({
          heading: oldHeading,
          airspeed: oldAirspeed,
          altitude: oldAltitude,
        }) => {
          const newAltitude = getNewAltitude({ oldAltitude, minChange: 3000, maxChange: 6000 });
          const newHeading = getNewHeading({ oldHeading, minChange: 60, maxChange: 120 });
          const newAirspeed = getNewAirspeed({ oldAirspeed, minChange: 20, maxChange: 60 });

          setTimeToNextChange(() => {
            return calculateNextTime({
              level: newLevel,
              headingDiff: Math.abs(newHeading - oldHeading),
              airspeedDiff: Math.abs(newAirspeed - oldAirspeed),
              altitudeDiff: Math.abs(newAltitude - oldAltitude),
            });
          });
  
          return {
            heading: newHeading,
            airspeed: newAirspeed,
            altitude: newAltitude,
          };
        });
        return newLevel;
      }; // end if (newLevel < 30)

      // 30 and higher
      setTarget(({
        heading: oldHeading,
        airspeed: oldAirspeed,
        altitude: oldAltitude,
      }) => {
        const newAltitude = getNewAltitude({ oldAltitude, minChange: 4000, maxChange: 12000 });
        const newHeading = getNewHeading({ oldHeading, minChange: 90, maxChange: 180 });
        const newAirspeed = getNewAirspeed({ oldAirspeed, minChange: 25, maxChange: 60 });

        setTimeToNextChange(() => {
          return calculateNextTime({
            level: newLevel,
            headingDiff: Math.abs(newHeading - oldHeading),
            airspeedDiff: Math.abs(newAirspeed - oldAirspeed),
            altitudeDiff: Math.abs(newAltitude - oldAltitude),
          });
        });

        return {
          heading: newHeading,
          airspeed: newAirspeed,
          altitude: newAltitude,
        };
      });
      return newLevel;
    });
  };

  useEffect(() => {
    if (timeToNextChange > 0 || timeToNextChange === null) {
      return;
    }

    if (timeToNextChange === 0) {
      void advanceLevel(oldLevel => oldLevel + 1);
    }
  }, [timeToNextChange]);

  useEffect(() => {
    const id = setInterval(
      () => {
        setTimeToNextChange(oldTimeToNextChange => {
          if (oldTimeToNextChange === null) return null;
          return oldTimeToNextChange - 1;
        });
      },
      1000,
    );
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="App">
      {level && <p>Level {level}</p>}
      {level && <p>{heading % 360}°</p>}
      {level && <p>{airspeed}kn</p>}
      {level && <p>{altitude}ft</p>}
      <p>{timeToNextChange === null ? 'Stopped' : secondsToHHMMSS(timeToNextChange)}</p>
      {!level && <button onClick={() => advanceLevel()}>Start</button>}
      {level && <button onClick={() => {
        setLevel(null);
        setTimeToNextChange(null);
      }}>Stop</button>}
    </div>
  );
}

export default App;
