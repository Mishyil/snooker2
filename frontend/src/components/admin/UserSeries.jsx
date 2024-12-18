import React from "react";
import { useGetSeries } from "../../hooks/queries/admin/useSeries";
import { ConstructionOutlined } from "@mui/icons-material";
import {
  Button,
  ListItemText,
  CircularProgress,
  IconButton,
  Typography,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import AddSeriesModal from "./modal/AddSeriesModal";
import { NavLink as RouterLink } from "react-router-dom";
import { useDeleteSeries } from "../../hooks/queries/admin/useSeries";

const UserSeries = () => {
  const { data, isLoading, error } = useGetSeries();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const filteredTournaments =
    data?.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const deleteSeriesMutation = useDeleteSeries();

  const handleDelete = async (id) => {
    deleteSeriesMutation.mutate(id);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Typography variant="h4">Мои серии турниров</Typography>
      <Box
        sx={{
          width: "100%",
          height: 400,
          bgcolor: "background.paper",
          p: 1.5,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Autocomplete
            sx={{ flex: 1, mr: 1 }}
            options={filteredTournaments}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Поиск серии"
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
          />
          <Button onClick={handleOpenModal}>Создать</Button>
        </Box>
        <FixedSizeList
          height={320}
          itemSize={80}
          itemCount={filteredTournaments.length}
          itemData={filteredTournaments}
        >
          {({ index, style, data }) => {
            const series = data[index];
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  p: 1.5,
                  gap: 1,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  {" "}
                  <Button
                    component={RouterLink}
                    to={`series/${series.id}`}
                    sx={{ textAlign: "left", width: "100%" }}
                  >
                    <ListItemText primary={series.name} />
                  </Button>
                </Box>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(series.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          }}
        </FixedSizeList>
        <AddSeriesModal open={isModalOpen} handleClose={handleCloseModal} />
      </Box>
    </>
  );
};

export default UserSeries;
