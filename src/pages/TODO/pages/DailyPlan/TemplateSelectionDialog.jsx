import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
  RvHookup as RvHookupIcon,
} from "@mui/icons-material";

const TemplateSelectionDialog = ({
  open,
  onClose,
  templates,
  selectedTemplates,
  onSelectTemplates,
  drivers,
  onCreate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template) => {
    if (!selectedTemplates.some((t) => t.id === template.id)) {
      const newTemplate = {
        ...template,
        editedName: template.name,
        driver_id: template.driver_id || "",
        truck: template.truck || "",
        trailer: template.trailer || "",
        stops: template.stops || [],
      };
      onSelectTemplates([...selectedTemplates, newTemplate]);
    }
  };

  const handleTemplateRemove = (templateId) => {
    onSelectTemplates(selectedTemplates.filter((t) => t.id !== templateId));
  };

  const handleTemplateUpdate = (updatedTemplate) => {
    onSelectTemplates(
      selectedTemplates.map((t) =>
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ bgcolor: "background.paper", py: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600">
            Load Tours from Templates
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search templates..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Available Templates ({filteredTemplates.length})
              </Typography>
              <List dense sx={{ maxHeight: 400, overflow: "auto" }}>
                {filteredTemplates.map((template) => (
                  <ListItem
                    key={template.id}
                    button
                    onClick={() => handleTemplateSelect(template)}
                    disabled={selectedTemplates.some(
                      (t) => t.id === template.id
                    )}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      "&.Mui-disabled": { opacity: 0.5 },
                    }}
                  >
                    <ListItemText
                      primary={template.name}
                      secondary={`Stops: ${template.stops?.length || 0}`}
                    />
                    {selectedTemplates.some((t) => t.id === template.id) && (
                      <Checkbox edge="end" checked disabled />
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Selected Templates ({selectedTemplates.length})
              </Typography>
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {selectedTemplates.map((template) => (
                  <Accordion
                    key={template.id}
                    defaultExpanded
                    sx={{ mb: 2, borderRadius: 2, boxShadow: "none" }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box width="100%" display="flex" alignItems="center">
                        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                          {template.editedName}
                        </Typography>
                        <Chip
                          label={`${template.stops?.length || 0} stops`}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateRemove(template.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Tour Name"
                        value={template.editedName}
                        onChange={(e) =>
                          handleTemplateUpdate({
                            ...template,
                            editedName: e.target.value,
                          })
                        }
                        sx={{ mb: 2 }}
                      />

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Driver</InputLabel>
                        <Select
                          value={template.driver_id || ""}
                          onChange={(e) =>
                            handleTemplateUpdate({
                              ...template,
                              driver_id: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            })
                          }
                        >
                          <MenuItem value="">
                            <em>No Driver</em>
                          </MenuItem>
                          {drivers.map((driver) => (
                            <MenuItem key={driver.id} value={driver.id}>
                              <ListItemText
                                primary={`${driver.first_name} ${driver.last_name}`}
                                secondary={
                                  <>
                                    <span>{driver.truck}</span>
                                    {driver.trailer && (
                                      <span> / {driver.trailer}</span>
                                    )}
                                  </>
                                }
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Truck Plate"
                            value={template.truck}
                            onChange={(e) =>
                              handleTemplateUpdate({
                                ...template,
                                truck: e.target.value,
                              })
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalShippingIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Trailer Plate"
                            value={template.trailer}
                            onChange={(e) =>
                              handleTemplateUpdate({
                                ...template,
                                trailer: e.target.value,
                              })
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <RvHookupIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "background.paper" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={selectedTemplates.length === 0}
          sx={{ borderRadius: 3 }}
        >
          Create {selectedTemplates.length} Tour
          {selectedTemplates.length > 1 ? "s" : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelectionDialog;
