import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { Box, useTheme, Typography } from '@mui/material';
import '../../../style/GlobalStyle.css'
import React from "react";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
// import { colorScale, countries, missingCountries } from "./Countries";

function WorldMap(props) {
  // console.log("in map file", mapData);

  const { mapData, tilesLables, flag } = props
  const colorScale = ["#E2AEFF", "#5E32CA"];
  return (


    <div style={{ margin: "auto", height: "200px" }} className='sekeltonContainer'>
      <h6>{tilesLables}</h6>
      {mapData ? (<VectorMap
        map={worldMill}
        containerStyle={{
          // width: "1000px",
          height: "200px",
        }}
        backgroundColor="#e6e6e6"
        // markers={missingCountries}
        markerStyle={{
          initial: {
            fill: "red",
          },
        }}
        series={{
          regions: [
            {
              scale: colorScale,
              values: mapData,
              min: 0,
              max: 50,
            },
          ],
        }}
        onRegionTipShow={function reginalTip(event, label, code) {
          return label.html(`
                <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white; padding-left: 10px">
                  <p>
                    <b>${label.html()}</b>
                  </p>
                  <p>
                    ${mapData[code] !== undefined ? mapData[code] : "No Data"}
                  </p>
                </div>`);
        }}
        onMarkerTipShow={function markerTip(event, label, code) {
          return label.html(`
                  <div style="background-color: white; border-radius: 6px; min-height: 50px; width: 125px; color: black !important; padding-left: 10px>
                    <p style="color: black !important;">
                    <b>
                    ${label.html()}
                    </b>
                    </p>
                    </div>`);
        }}
      />) : (
        <Typography variant="body1" color="textSecondary" className='dataLoader'>
          {flag == 0 ? (
            <Box sx={{ position: 'relative' }} >
              <CircularProgress
                variant="determinate"
                sx={{
                  color: (theme) =>
                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
              />
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                  animationDuration: '550ms',
                  position: 'absolute',
                  left: 0,
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                  },
                }}
                size={40}
                thickness={4}
                {...props}
              />
            </Box>
          ) : (

            <h2>Data Not Available</h2>
          )
          }

        </Typography>
      )}

    </div>
  );
}

export default WorldMap;
