import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "service/ApiEndpoints";
import Client from "service/Client";
import ResponsiveDialog from "components/shared/modal";
import PropTypes from "prop-types";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import NavHeaderSelect from "components/shared/NavHeaderSelect";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Row } from "components/shared/Row";
import Categories2 from "./categories2";

export default function Categories() {
  const [data, setData] = useState(null);
  const [openDelete, setOpen] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [alignment, setAlignment] = React.useState("web");
  const [page, setPage] = React.useState(1);
  const [type, setType] = useState("bistro");
  const [count, setCount] = useState(10);

  const handleChangePag = async (event, value) => {
    setPage(value);
    await Client.get(`${API_ENDPOINTS.CATEGORIES}?page=${value}&type=${type}`)
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  async function getCategories() {
    await Client.get(
      `${API_ENDPOINTS.CATEGORIES}?page=${page}&type=bistro&parent_is_null=true`
    )
      .then((resp) => {
        setData(resp.results);
        setCount(resp.count);
      })
      .catch((err) => console.log(err));
  }
  const ITEM_HEIGHT = 48;
  console.log(count);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };

  const Search = async (e) => {
    await Client.get(`${API_ENDPOINTS.CATEGORIES}?search=${e}`)
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const Bistre = async () => {
    setPage(1);
    setType("bistro");
    await Client.get(
      `${API_ENDPOINTS.CATEGORIES}?page=${page}&type=bistro&parent_is_null=true`
    )
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
    await Client.get(
      `${API_ENDPOINTS.CATEGORIES}?page=${page}&type=byuti&parent_is_null=true`
    )
      .then((resp) => {
        console.log(resp);
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      {/* <NavHeaderSelect title="Kategoriyalar" />
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        // aria-label="Platform"
        className="mt-5"
      >
        <ToggleButton style={{ width: "500px" }} onClick={Bistre} value="web">
          Быстрый
        </ToggleButton>
        <ToggleButton
          style={{ width: "500px" }}
          onClick={Beauty}
          value="android"
        >
          Beauty
        </ToggleButton>
      </ToggleButtonGroup>
      <input
        type="text"
        placeholder="Kategoriya izlang..."
        className=" px-3 ps-5 py-3 border-2 rounded-md my-3 border-3  hover:outline-none focus:outline-none active:outline-none"
        style={{ width: "100%" }}
        onChange={(e) => Search(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Ko'rish</TableCell>
              <TableCell>Nomi</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Row row={data} />
          </TableBody>
        </Table>
      </TableContainer>

      <ResponsiveDialog
        open={openDelete}
        setOpen={setOpen}
        // handleDelete={handleDelete}
      />
      <div className="mt-3">
        <Stack spacing={2}>
          <Typography> Sahifa : {page}</Typography>
          <Pagination
            count={Math.trunc(count / 10) < 1 ? 1 : Math.trunc(count / 10)}
            page={page}
            onChange={handleChangePag}
          />
        </Stack>
      </div> */}

      <Categories2/>
    </div>
  );
}
