import { useState } from "react";
import { Dialog, DialogActions, DialogContent, Paper, Table } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { determine2Cards, determine3Cards, isBlindSetting } from "../helperFunctions";

export default function GameOverLogsDialog({ game, gameOverLogsOpen, setGameOverLogsOpen }) {
  return (
    <Dialog
      open={gameOverLogsOpen}
      onClose={() => setGameOverLogsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <GameOverLogsTabs game={game} />
      </DialogContent>
    </Dialog>
  );
}

function CustomTable({ rows, columns }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                  {columns.map(column => {
                    const value = column.id === "randomProb" ? row[column.id].toFixed(3) : row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number" ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function GameOverLogsTabs({ game }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const defaultActionsColumns = [
    { id: "govNum", label: "Gov", minWidth: 50 },
    { id: "playerName", label: "Name", minWidth: 50 },
    { id: "role", label: "Role", minWidth: 50 },
    {
      id: "actionName",
      label: "Action",
      minWidth: 70,
    },
    {
      id: "probabilityName",
      label: "Type",
      minWidth: 100,
    },
    {
      id: "threshold",
      label: "Threshold",
      minWidth: 50,
    },
    {
      id: "randomProb",
      label: "Random Prob",
      minWidth: 100,
    },
  ];

  defaultActionsColumns.forEach(col => (col.align = "center"));
  const defaultActionRows = game.defaultProbabilityLog;

  const govsColumns = [
    { id: "govNum", label: "Gov", minWidth: 30 },
    { id: "pres", label: "Pres", minWidth: 30 },
    { id: "chan", label: "Chan", minWidth: 30 },
    {
      id: "deckNum",
      label: "Deck",
      minWidth: 30,
    },
    {
      id: "presCards",
      label: "Pres Policies",
      minWidth: 90,
    },
    {
      id: "chanCards",
      label: "Chan Policies",
      minWidth: 90,
    },
    {
      id: "policyPlayed",
      label: "Enacted",
      minWidth: 30,
    },
    {
      id: "presClaim",
      label: "Pres Claim",
      minWidth: 75,
    },
    {
      id: "chanClaim",
      label: "Chan Claim",
      minWidth: 75,
    },
  ];

  govsColumns.forEach(col => (col.align = "center"));
  const govsRows = game.govs.map((gov, idx) => ({
    ...gov,
    govNum: idx + 1,
    policyPlayed: gov.policyPlayed.color,
    presCards: determine3Cards(gov.presCards),
    chanCards: determine2Cards(gov.chanCards),
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Governments" {...{ id: "simple-tab-0", "aria-controls": `simple-tabpanel-0` }} />
          <Tab
            label="Default Actions"
            disabled={!isBlindSetting(game.settings.type)}
            {...{ id: "simple-tab-1", "aria-controls": `simple-tabpanel-1` }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CustomTable rows={govsRows} columns={govsColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CustomTable rows={defaultActionRows} columns={defaultActionsColumns} />
      </CustomTabPanel>
    </Box>
  );
}

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
