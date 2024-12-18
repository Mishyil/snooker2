import React from "react";
import { useParams } from "react-router-dom";
import { useGetSeriesById } from "../../hooks/queries/admin/useSeries";
import { useState, useEffect } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Box,
} from "@mui/material";
import { useUpdateSeries } from "../../hooks/queries/admin/useSeries";

const SeriesSettings = () => {
  const { seriesId } = useParams();
  const { data, isLoading, error } = useGetSeriesById(seriesId);
  const [seriesData, setSeriesData] = useState({
    name: "",
    description: "",
    visible: false,
  });
  const updateSeriesMutations = useUpdateSeries();
  useEffect(() => {
    if (data) {
      setSeriesData(data);
    }
  }, [data]);

  const handleChange = (field) => (event) => {
    setSeriesData({
      ...seriesData,
      [field]: field === "visible" ? event.target.checked : event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
		updateSeriesMutations.mutate({ id: seriesId, data: seriesData })
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <Typography variant="h3">Настройки серии</Typography>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          p: 1.5,
          borderRadius: 1,
        }}
      >
        <form noValidate autoComplete="off">
          <TextField
            label="Название"
						value={seriesData.name || ""}
            onChange={handleChange("name")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Описание"
						value={seriesData.description || ""}
            onChange={handleChange("description")}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            maxRows={6}
            sx={{
              "& .MuiInputBase-root": {
                minHeight: "150px",
              },
            }}
          />
          <Box sx={{ m: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={seriesData.visible}
                  onChange={handleChange("visible")}
                  color="primary"
                />
              }
              label="Видимость серии"
            />
          </Box>
          <Box>
            <Button variant="contained"  type="submit"  color="primary" onClick={handleSubmit}>
              Сохранить изменения
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default SeriesSettings;
