import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Autocomplete,
	ButtonBase 
} from "@mui/material";
const AddPlayersToGroupModal = ({
  selectedOptions,
  setSelectedOptions,
  inputValue,
  setInputValue,
  handleOptionToggle,
  handleButtonClick,
  handleCloseModal,
  options,
}) => {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Autocomplete
        sx={{ flex: "0 1 auto" }}
        multiple
        options={options}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedOptions}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ minHeight: "auto", mb: 1, width: "100%" }}
            label="Search"
            variant="standard"
          />
        )}
      />
      <Box
        sx={{
          flex: "1 1 auto",
          maxHeight: "500px",
          overflow: "auto",
          mt: 2,
          width: "100%",
        }}
      >
        <List sx={{ width: "100%" }}>
          {options.map((option) => (
            <ListItem
              key={option.id}
              sx={{ width: "100%" }}
            >
              <Checkbox
                checked={selectedOptions.some(
                  (selected) => selected.id === option.id
                )}
								onClick={() => handleOptionToggle(option)}
              />
              <ListItemText
                primary={`${option.first_name} ${option.last_name}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Добавить
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
          Закрыть
        </Button>
      </Box>
    </Container>
  );
};

export default AddPlayersToGroupModal;
