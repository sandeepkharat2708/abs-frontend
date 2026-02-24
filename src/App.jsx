import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Paper, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack,
  Chip, IconButton, AppBar, Toolbar, Card, CardContent, Grid
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const API = "http://localhost:5000/appointments";

export default function App() {

  const emptyForm = {
    patient_name: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
    fee: "",
    status: "Scheduled"
  };

  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await axios.get(API);
    setAppointments(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOpen = (appt = null) => {
    if (appt) {
      setForm(appt);
      setEditingId(appt._id);
    } else {
      setForm(emptyForm);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (editingId)
      await axios.put(`${API}/${editingId}`, form);
    else
      await axios.post(API, form);

    setOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    await axios.delete(`${API}/${deleteId}`);
    setDeleteId(null);
    fetchData();
  };

  const statusColor = s =>
    s === "Completed" ? "success"
    : s === "Cancelled" ? "error"
    : "warning";

  const filtered = appointments.filter(a =>
    a.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  // Dashboard counts
  const total = appointments.length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;

  return (
    <>
      {/* APP BAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Hospital Appointment System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {/* DASHBOARD CARDS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h4">{total}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completed</Typography>
                <Typography variant="h4">{completed}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Cancelled</Typography>
                <Typography variant="h4">{cancelled}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEARCH + ADD */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search Patient"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add
          </Button>
        </Stack>

        {/* TABLE */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map(a => (
                <TableRow key={a._id}>
                  <TableCell>{a.patient_name}</TableCell>
                  <TableCell>{a.doctor_name}</TableCell>
                  <TableCell>
                    {new Date(a.appointment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{a.appointment_time}</TableCell>
                  <TableCell>₹{a.fee}</TableCell>

                  <TableCell>
                    <Chip label={a.status} color={statusColor(a.status)} />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(a)}>
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => setDeleteId(a._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

      </Container>

      {/* ADD / EDIT MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editingId ? "Edit Appointment" : "Add Appointment"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Patient Name"
              name="patient_name" value={form.patient_name}
              onChange={handleChange} />

            <TextField label="Doctor Name"
              name="doctor_name" value={form.doctor_name}
              onChange={handleChange} />

            <TextField type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange} />

            <TextField type="time"
              name="appointment_time"
              value={form.appointment_time}
              onChange={handleChange} />

            <TextField label="Reason"
              name="reason" value={form.reason}
              onChange={handleChange} />

            <TextField type="number"
              label="Fee"
              name="fee" value={form.fee}
              onChange={handleChange} />

            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={Boolean(deleteId)}>
        <DialogTitle>Delete Appointment?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}