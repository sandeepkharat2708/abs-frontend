import { useState } from "react";
import Navbar from "./Navbar";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import "./App.css";

function App(){

const [showForm,setShowForm] = useState(false);

return(

<div>

<Navbar/>

<div className="main-container">

<button
className="add-btn"
onClick={()=>setShowForm(!showForm)}
>
➕ Add New Appointment
</button>

{showForm && <AppointmentForm/>}

<AppointmentList/>

</div>

</div>

);

}

export default App;