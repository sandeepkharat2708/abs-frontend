import {useState} from "react";
import axios from "axios";
import "./AppointmentForm.css";

const doctors=[
"Sushant Chavan (Pediatric)",
"Anjali Patil (Dermatologist)",
"Rohit Kulkarni (Cardiologist)",
"Neha Deshmukh (Gynecologist)",
"Amit Joshi (Orthopedic)",
"Priya Sharma (Neurologist)",
"Rahul Mehta (ENT)",
"Kiran Pawar (General Physician)",
"Sneha More (Dentist)"
];

function AppointmentForm(){

const[form,setForm]=useState({
patient_name:"",
doctor_name:"",
appointment_date:"",
appointment_time:"",
reason:"",
fee:""
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const submit=async(e)=>{
e.preventDefault();

try{
await axios.post("http://localhost:5000/api/appointments",form);
alert("Appointment booked");
window.location.reload();
}catch(err){
alert(err.response?.data?.message || "Error");
}
};

return(

<div className="form-container">

<form className="appointment-form" onSubmit={submit}>

<h2>Book Appointment</h2>

<input
placeholder="Patient Name"
name="patient_name"
onChange={handleChange}
required
/>

<select name="doctor_name" onChange={handleChange} required>
<option value="">Select Doctor</option>

{doctors.map((d,i)=>(
<option key={i} value={d}>{d}</option>
))}

</select>

<input
type="date"
name="appointment_date"
onChange={handleChange}
required
/>

<input
type="time"
name="appointment_time"
onChange={handleChange}
required
/>

<input
placeholder="Reason"
name="reason"
onChange={handleChange}
/>

<input
type="number"
placeholder="Consultation Fee"
name="fee"
onChange={handleChange}
required
/>

<button type="submit">Book Appointment</button>

</form>

</div>

);
}

export default AppointmentForm;