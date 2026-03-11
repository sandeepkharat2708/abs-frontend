import { useEffect, useState } from "react";
import axios from "axios";
import "./AppointmentList.css";

function AppointmentList() {

const [data, setData] = useState([]);
const [editing, setEditing] = useState(null);

useEffect(() => {
fetchAppointments();
}, []);

const fetchAppointments = () => {
axios
.get("http://localhost:5000/api/appointments")
.then(res => setData(res.data));
};

const daysUntil = (date) => {
const today = new Date();
const d = new Date(date);
return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
};

const deleteAppointment = async (id) => {

if(window.confirm("Delete this appointment?")){

await axios.delete(`http://localhost:5000/api/appointments/${id}`);

fetchAppointments();

}

};

const startEdit = (appointment) => {

setEditing({ ...appointment });

};

const handleEditChange = (e) => {

setEditing({

...editing,
[e.target.name]: e.target.value

});

};

const saveEdit = async () => {

await axios.put(

`http://localhost:5000/api/appointments/${editing._id}`,
editing

);

setEditing(null);

fetchAppointments();

};

return (

<div className="appointments-card">

<h2>📅 Appointments</h2>

<table className="appointments-table">

<thead>

<tr>

<th>Patient</th>
<th>Doctor</th>
<th>Date</th>
<th>Time</th>
<th>Days Left</th>
<th>Status</th>
<th>Fee</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{data.map((a) => {

const isEditing = editing && editing._id === a._id;

const days = daysUntil(a.appointment_date);

return (

<tr
key={a._id}
className={isEditing ? "editing-row" : ""}
>

<td>

{isEditing ? (

<input
className="edit-input"
name="patient_name"
value={editing.patient_name}
onChange={handleEditChange}
/>

) : (

a.patient_name

)}

</td>

<td>{a.doctor_name}</td>

<td>

{isEditing ? (

<input
className="edit-input"
type="date"
name="appointment_date"
value={editing.appointment_date.substring(0,10)}
onChange={handleEditChange}
/>

) : (

a.appointment_date?.substring(0,10)

)}

</td>

<td>

{isEditing ? (

<input
className="edit-input"
type="time"
name="appointment_time"
value={editing.appointment_time}
onChange={handleEditChange}
/>

) : (

a.appointment_time

)}

</td>

<td className={days <= 3 ? "urgent" : ""}>

{days}

</td>

<td>

{isEditing ? (

<select
className="edit-input"
name="status"
value={editing.status}
onChange={handleEditChange}
>

<option value="Scheduled">Scheduled</option>
<option value="Completed">Completed</option>
<option value="Cancelled">Cancelled</option>

</select>

) : (

<span className={`status ${a.status?.toLowerCase()}`}>
{a.status}
</span>

)}

</td>
<td>

{isEditing ? (

<input
className="edit-input"
type="number"
name="fee"
value={editing.fee}
onChange={handleEditChange}
/>

) : (

`₹${a.fee}`

)}

</td>

<td>

{isEditing ? (

<>

<button
className="save-btn"
onClick={saveEdit}
>

Save

</button>

<button
className="cancel-btn"
onClick={() => setEditing(null)}
>

Cancel

</button>

</>

) : (

<>

<button
className="edit-btn"
onClick={() => startEdit(a)}
>

Edit

</button>

<button
className="delete-btn"
onClick={() => deleteAppointment(a._id)}
>

Delete

</button>

</>

)}

</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}

export default AppointmentList;