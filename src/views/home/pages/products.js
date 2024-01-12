import NavHeaderSelect from "components/shared/NavHeaderSelect";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
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
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const headCells = [
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Id",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Nomi",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Hajmi",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Narxi",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Chegirmasi",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Sotuvda",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Aksiya",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Amallar",
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
          >
            <span className="font-bold text-[16px]"> {headCell.label}</span>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState("bistro");
  const [data, setData] = React.useState(null);
  const [count, setCount] = useState("");
  const [constCount, setConstCount] = useState("");
  const [openDelete, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryValue, setCategoryValue] = useState(null);
  const [SaleValue, setSaleValue] = useState(null);
  const [errorData, setErrorData] = useState("");
  const [sale_product, setSale_product] = useState([
    {
      id: 1,
      name: "Sotuvda",
      value: "true",
    },
    {
      id: 2,
      name: "Sotuvda emas",
      value: "false",
    },
  ]);

  const handleChange = async (e) => {
    setType(e.target.value);
    setPage(1);
    await Client.get(
      `${API_ENDPOINTS.PRODUCT}?page=${page}&type=${e.target.value}`
    )
      .then((resp) => {
        setCount(resp.count);
        setData(resp.results);
        setConstCount(resp.count)
      })
      .catch((err) => console.log(err));
  };

  const getProductData = async () => {
    setPage(1);
    setType("bistro");
    await Client.get(`${API_ENDPOINTS.PRODUCT}?page=${page}&type=bistro`)
      .then((resp) => {
        setCount(resp.count);
        setConstCount(resp.count)
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };
  const getCategory = async () => {
    await Client.get(`${API_ENDPOINTS.CATEGORIES_CHAILD}`)
      .then((resp) => {
        setCategory(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const Search = async (e) => {
    await Client.get(`${API_ENDPOINTS.PRODUCT}?type=${type}&search=${e}`)
      .then((resp) => {
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async () => {
    await Client.delete(`${API_ENDPOINTS.DELETE_PRODUCT}${deleteId}/`)
      .then((resp) => {
        console.log(resp);
        setOpen(false);
        getProductData();
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        setErrorData(err.response.data.msg);
      });
  };

  const handleChangePag = async (event, value) => {
    setPage(value);
    await Client.get(`${API_ENDPOINTS.PRODUCT}?page=${value}&type=${type}`)
      .then((resp) => {
        setCount(resp.count);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeCategory = async (event) => {
    setCategoryValue(event.target.value);
    await Client.get(
      `${API_ENDPOINTS.PRODUCT}?page=${page}&type=${type}&product_categories__category_id=${event.target.value}`
    )
      .then((resp) => {
        setCount(resp.results);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeSale = async (event) => {
    setSaleValue(event.target.value);
    await Client.get(
      `${API_ENDPOINTS.PRODUCT}?page=${page}&type=${type}&on_sale=${event.target.value}`
    )
      .then((resp) => {
        setCount(resp.results);
        setData(resp.results);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProductData();
    getCategory();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="">
        <NavHeaderSelect title="Mahsulotlar" />
      </div>
      <div className="mb-5">
        <h1 className="text-2xl font-sans">Jami mahsulotlar <span className="slashed-zero font-semibold font-mono text-[#3B82F6]">{constCount}</span>  {constCount ? "ta  " : ''}</h1>
      </div>
      <ToggleButtonGroup
        color="primary"
        value={type}
        exclusive
        onChange={handleChange}
        className="mt-5 flex items-center w-full"
      >
        <ToggleButton className="w-full" value="bistro">
          Bistro
        </ToggleButton>
        <ToggleButton className="w-full" value="byuti">
          Byuti
        </ToggleButton>
      </ToggleButtonGroup>
      <input
        type="text"
        placeholder="Izlash"
        className=" lg:w-1/3 md:w-1/3 sm:w-full   px-3 ps-5 py-2 border-2 rounded-md my-3 border-3  hover:outline-none focus:outline-none active:outline-none"
        onChange={(e) => Search(e.target.value)}
      />
      <FormControl
        size="small"
        className=" w-1/3  "
        style={{ marginTop: "12px" }}
      >
        <InputLabel id="demo-select-small-label" placholder="Holat bo'yicha">
          Kategoriya
        </InputLabel>
        <Select
          className="py-0.5"
          value={categoryValue}
          label="Holat bo'yicha"
          onChange={handleChangeCategory}
        >
          <MenuItem value={""}>
            <i className="fa-solid fa-minus"></i>{" "}
          </MenuItem>
          {category ? (
            category?.map((item, i) => (
              <MenuItem key={i} value={item.id}>
                {item.name}
              </MenuItem>
            ))
          ) : (
            <></>
          )}
        </Select>
      </FormControl>
      <FormControl
        size="small"
        className="w-1/3 "
        style={{ marginTop: "12px" }}
      >
        <InputLabel id="demo-select-small-label" placholder="Sotuv bo'yicha">
          Sotuv bo'yicha
        </InputLabel>
        <Select
          className="py-0.5"
          value={SaleValue}
          label="Sotuv bo'yicha"
          onChange={handleChangeSale}
        >
          <MenuItem value={""}>
            <i className="fa-solid fa-minus"></i>{" "}
          </MenuItem>
          {sale_product &&
            sale_product?.map((item, i) => (
              <MenuItem key={i} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead rowCount={data?.length} />
              <TableBody>
                {data?.length >= 0 ? (
                  data?.map((row, index) => {
                    return (
                      <TableRow hover key={row.id}>
                        <TableCell align="left">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {row.id}
                          </Link>
                        </TableCell>
                        <TableCell align="left">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {row.name}
                          </Link>
                        </TableCell>
                        <TableCell align="left">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {row.specification}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {JSON.parse(row.price)} so'm
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {row.discount !== 0 ? (
                              <>
                                {row.discount}{" "}
                                <i className="fa-solid fa-percent"></i>{" "}
                              </>
                            ) : (
                              <i className="fa-solid fa-minus"></i>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            {row.on_sale ? (
                              <i
                                style={{ color: "green" }}
                                className=" fa-regular fa-circle-check"
                              ></i>
                            ) : (
                              <i
                                style={{ color: "red" }}
                                className="fa-regular fa-circle-xmark"
                              ></i>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            <span style={{ color: `${row?.badge?.textColor}` }}>
                              {row?.badge?.text ? (
                                row?.badge?.text
                              ) : (
                                <i className="fa-solid fa-minus"></i>
                              )}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell align="right" sx={{ position: "relative" }}>
                          <Link
                            to={`actions/?${row.type}?addVariant?${row.slug}?${row.variant_id}`}
                          >
                            <IconButton color="primary" aria-label="delete">
                              <AddCircleOutlinedIcon />
                            </IconButton>
                          </Link>
                          {row.is_delete ? (
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
                          ) : (
                            ""
                          )}
                          <Link to={`actions/?${row.type}?edit?${row.slug}`}>
                            <IconButton color="primary">
                              <DriveFileRenameOutlineOutlinedIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      wdith: "100%",
                      justifyContent: "center",
                      padding: "150px 0",
                      marginLeft: "400px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!(count >= 30) ? (
            <></>
          ) : (
            <div className="m-3 mb-5">
              <Stack spacing={2}>
                <Typography> Sahifa : {page}</Typography>
                <Pagination
                  count={Math.ceil(count / 30) <= 1 ? 1 : Math.ceil(count / 30)}
                  page={page}
                  onChange={handleChangePag}
                />
              </Stack>
            </div>
          )}
        </Paper>
      </Box>
      <ResponsiveDialog
        open={openDelete}
        setOpen={setOpen}
        handleDelete={handleDelete}
        errorData={errorData}
      />
    </>
  );
}
