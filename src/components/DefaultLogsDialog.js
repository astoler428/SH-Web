import { useState } from "react";
import { Dialog, DialogActions, DialogContent, Paper, Table } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function DefaultLogsDialog({ game, defaultLogsOpen, setDefaultLogsOpen }) {
  return (
    <Dialog
      open={defaultLogsOpen}
      onClose={() => setDefaultLogsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth="md"
      // sx={{ width: 800 }}
    >
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <StickyHeadTable game={game} />
      </DialogContent>
    </Dialog>
  );
}

const columns = [
  { id: "playerName", label: "Name", minWidth: 50 },
  { id: "govNum", label: "Gov", minWidth: 50 },
  { id: "role", label: "Role", minWidth: 50 },
  {
    id: "threshold",
    label: "Threshold / Probability",
    minWidth: 150,
  },
  {
    id: "randomProb",
    label: "Random Prob",
    minWidth: 100,
  },
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
];
columns.forEach(col => (col.align = "center"));

export function StickyHeadTable({ game }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = game.defaultProbabilityLog;

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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={Math.random()}>
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
