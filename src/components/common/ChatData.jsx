import React, { useState } from "react";
import {
  createStyles,
  makeStyles,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { MessageLeft } from "./Chatmessage.jsx";
const theme = createTheme();

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: "80vw",

      maxWidth: "650px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      boxShadow: "none"
    },
    MuiPaperelevation1: {
      boxShadow: "none"
    },
    paper2: {
      width: "80vw",
      maxWidth: "650px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      height: "calc( 100% - 80px )"
    },
    greenAvatar: {
      backgroundColor: theme.palette.success.main,
    },
    redAvatar: {
      backgroundColor: theme.palette.error.main,
    },
    // table: {
    //   // minWidth: 950,
    // },
    tableHeader: {
      backgroundColor: "black",
      "& th": {
        color: "white",
      },
    },
    tableRow: {
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    redRow: {
      backgroundColor: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.main,
      },
    },
  })
);
const useStylesRow = makeStyles({
  customTable: {
    "& .MuiTableCell-sizeSmall": {
      padding: "6px 0px 6px 16px" // <-- arbitrary value
    }
  },
});


export default function Chatdata(props) {
  const classes = useStyles();
  const classesRow = useStylesRow();
  const { anomalyData, anomalyNonanomalyData, closeFun } = props;
  const [showTable, setShowTable] = useState(false);
  if (!anomalyData || anomalyData.length === 0) {
    return null;
  }
  //  console.log('anomalyData2', anomalyData)



  const showTableHandler = () => {
    setShowTable(true);
  };




  return (
    <div className={classes.container}>
      <Paper className={classes.paper} zDepth={2}>
        <Paper id="style-1" className={classes.messagesBody}>

          {anomalyData.map((data, index) => {
            const { MTEXT_CLIENTNAME, Requisition_Request_Date } = data;

            // Formatting the date
            const RequisitionRequestDate = new Date(Requisition_Request_Date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            const anomalyMessage = `There is an anomaly for ${MTEXT_CLIENTNAME} on ${RequisitionRequestDate}`;

            return (
              <React.Fragment key={index}>
                <MessageLeft message={anomalyMessage}
                  photoURL="data:image/jpeg;base64,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"
                  displayName="" avatarDisp={true} />
                {index === anomalyData.length - 1 && (
                  <MessageLeft message={<strong>Do you want to see ?</strong>}
                    photoURL="data:image/jpeg;base64,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"
                    displayName="" avatarDisp={true} />
                )}
              </React.Fragment>
            );
          })}

          <div style={{ display: "flex", float: "right", marginBottom: "5px" }}>
            <Button
              onClick={showTableHandler}
              style={{ backgroundColor: "#4CAF50", color: "white", marginRight: "10px", borderRadius: "5px" }}
            >
              Yes
            </Button>
            <Button
              onClick={closeFun}
              style={{ backgroundColor: "#f44336", color: "white", borderRadius: "5px" }}
            >No</Button>
          </div>
          {showTable && (
            <TableContainer component={Paper}>
              <Table classes={{ root: classesRow.customTable }} size="small">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell >Supplier Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Lead Time Variability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anomalyNonanomalyData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={`${classes.tableRow} ${row.anomaly === -1 ? classes.redRow : ""
                        }`}
                    >
                      <TableCell>{row.MTEXT_CLIENTNAME}</TableCell>
                      <TableCell>
                        {new Date(row.Requisition_Request_Date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>{row.Supplier_Lead_Time_Variability}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>  
              </Table>
              <Button
                onClick={closeFun}
                style={{ backgroundColor: "#4d0000", color: "white", borderRadius: "5px" , position: "absolute",  right: "0",marginTop:'1rem'}}
              >Close</Button>
            </TableContainer>


          )}
        </Paper>
      </Paper>
    </div>
  );
}