import NavHeaderSelect from "components/shared/NavHeaderSelect";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Client from "service/Client";
import { API_ENDPOINTS } from "service/ApiEndpoints";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { Link } from "react-router-dom";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import ResponsiveDialog from "components/shared/modal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Id",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Nomi",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Aktiv",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Amallar",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <span className="font-bold text-[16px]" >  {headCell.label} </span>
            
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState("bistro");
  const [data, setData] = React.useState(null);
  const [count, setCount] = useState(10);
  const [openDelete, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  console.log(">", selected);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const Bistre = async () => {
    setPage(1);
    setType("bistro");
    await Client.get(`${API_ENDPOINTS.RETCIPE}?page=${page}&type=bistro`)
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };
  const Beauty = async () => {
    setPage(1);
    setType("byute");
    await Client.get(`${API_ENDPOINTS.RETCIPE}?page=${page}&type=byuti`)
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = async (e) => {
    setPage(1);
    setType(e.target.value);
    await Client.get(
      `${API_ENDPOINTS.RETCIPE}?page=${page}&type=${e.target.value}`
    )
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const getRetsipeData = async () => {
    setPage(1);
    setType("bistro");
    await Client.get(`${API_ENDPOINTS.RETCIPE}?page=1&type=bistro`)
      .then((resp) => {
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const Search = async (e) => {
    await Client.get(`${API_ENDPOINTS.RETCIPE}?search=${e}`)
      .then((resp) => {
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async () => {
    await Client.delete(`${API_ENDPOINTS.DELETE_RECIPE}${deleteId}/`)
      .then((resp) => {
        console.log(resp);
        setOpen(false);
        getRetsipeData();
      })
      .catch((err) => console.log(err));
  };

  const handleChangePag = async (event, value) => {
    setPage(value);
    await Client.get(`${API_ENDPOINTS.RETCIPE}?page=${value}&type=${type}`)
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getRetsipeData();
  }, []);
  return (
    <>
      <div className="mb-5">
        <NavHeaderSelect title="Retseptlar" />
      </div>
      <ToggleButtonGroup
        color="primary"
        value={type}
        exclusive
        onChange={handleChange}
        className="mt-5 flex items-center w-full"
      >
        <ToggleButton className="w-full" onClick={Bistre} value="bistro">
          Bistro
        </ToggleButton>
        <ToggleButton className="w-full" onClick={Beauty} value="apteka">
          Aptika
        </ToggleButton>
      </ToggleButtonGroup>
      <input
        type="text"
        placeholder="Izlash"
        className=" px-3 ps-5 py-3 border-2 rounded-md my-3 border-3  hover:outline-none focus:outline-none active:outline-none"
        style={{ width: "100%" }}
        onChange={(e) => Search(e.target.value)}
      />

      {data?.length > 0 ? (
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size="medium"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                />
                <TableBody>
                  {data?.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.title}</TableCell>
                        <TableCell align="right">
                          {row.is_active ? (
                            <i
                              style={{ color: "green" }}
                              className=" fa-regular fa-circle-check"
                            ></i>
                          ) : (
                            <i
                              style={{ color: "red" }}
                              className="fa-regular fa-circle-xmark"
                            ></i>
                          )}{" "}
                        </TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right" sx={{ position: "relative" }}>
                          <Link to={`actions/?edit?${row.slug}`}>
                            <IconButton color="primary">
                              <DriveFileRenameOutlineOutlinedIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setDeleteId(row.slug);
                              setOpen(true);
                            }}
                            aria-label="delete"
                          >
                            <DeleteSharpIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {(count && Math.ceil(count / 30) <= 1) || count === 0 ? (
              <></>
            ) : (
              <div className="m-3 mb-5">
                <Stack spacing={2}>
                  <Typography> Sahifa : {page}</Typography>
                  <Pagination
                    count={
                      Math.ceil(count / 30) < 1 ? 1 : Math.ceil(count / 30)
                    }
                    page={page}
                    onChange={handleChangePag}
                  />
                </Stack>
              </div>
            )}
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            wdith: "100%",
            justifyContent: "center",
            padding: "150px 0",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <ResponsiveDialog
        open={openDelete}
        setOpen={setOpen}
        handleDelete={handleDelete}
      />
    </>
  );
}
