import React from "react";
import { useGetSeries } from "../hooks/queries/useSeries";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";

const SeriesList = () => {
  const { data, isLoading, error } = useGetSeries();

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Произошла ошибка: {error.message}</p>;

  return (
    <>

      <Typography variant="h3">Серии турниров</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 340 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((series) => (
              <TableRow
                key={series.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    component={RouterLink}
                    to={`/series/${series.id}`}
                  >
                    {series.name}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SeriesList;
