// import Create from "./components/create";
import "./App.css";
import React from "react";
// import FormData from "form-data";
import axios from "axios";

function App() {

  const [id, setId] = React.useState("");

  const changecurrentbox = () => {
    const currentbox = document.querySelector(".currentbox");
    currentbox.classList.remove("currentbox");
    currentbox.classList.add("invalid");
    currentbox.nextElementSibling.classList.add("currentbox");
    currentbox.nextElementSibling.classList.remove("invalid");
  };

  const submitform = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    // form.append("type","CREATE_DELIVERY");
    const data = Object.fromEntries(form.entries());
    // console.log(dataform);
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/deliveries/create",
      headers: {
        "Content-Type": "text/plain",
      },
      data: {
        type: "CREATE_DELIVERY",
        data,
      },
    };
    await axios(config)
      .then(function (response) {
        setId(response.data.id);
        console.log(JSON.stringify(response.data));
        changecurrentbox();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (

    <div className="container">
      <div className="box currentbox">
        <h1>CREATE ORDER</h1>
        <form onSubmit={submitform}>
          <div className="form-content">
            <label htmlFor="budget">Budget</label>
            <input type="number" name="budget" id="budget" />
          </div>
          <div className="form-content">
            <label htmlFor="notes">Notes</label>
            <input type="text" name="notes" id="notes" />
          </div>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
      <div className="box invalid">Start Order</div>
      <div className="box invalid">Start Order</div>
      <div className="box invalid">Start Order</div>
    </div>
  );
}

export default App;
