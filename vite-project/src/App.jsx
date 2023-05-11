import "./App.css";
import React from "react";
import axios from "axios";
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";

function App() {
  const [id, setId] = React.useState("");
  const [first, setFirst] = React.useState(true);
  const [second, setSecond] = React.useState(false);
  const [third, setThird] = React.useState(false);
  const [fourth, setFourth] = React.useState(false);

  const changecurrentbox = () => {
    const currentbox = document.querySelector(".currentbox");
    currentbox.classList.remove("currentbox");
    currentbox.classList.add("invalid");
    currentbox.nextElementSibling.classList.add("currentbox");
    currentbox.nextElementSibling.classList.remove("invalid");
  };

  const createDeliveryForm = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
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
        setFirst(false);
        setSecond(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const startDeliveryForm = async (e) => {
    e.preventDefault();
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/events",
      headers: {
        "Content-Type": "text/plain",
      },
      data: {
        type: "START_DELIVERY",
        delivery_id: id,
        data: {},
      },
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        changecurrentbox();
        setSecond(false);
        setThird(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const pickupDelivery = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/events",
      headers: {
        "Content-Type": "text/plain",
      },
      data: {
        type: "PICKUP_DELIVERY",
        delivery_id: id,
        data,
      },
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        changecurrentbox();
        setThird(false);
        setFourth(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deliverProducts = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/events",
      headers: {
        "Content-Type": "text/plain",
      },
      data: {
        type: "DELIVER_PRODUCTS",
        delivery_id: id,
        data,
      },
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const confetti = document.getElementById("confetti");
        confetti.style.display = "block";
        setTimeout(() => {
          confetti.style.display = "none";
        }, 5000);
        alert("DELIVERY COMPLETED");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const checkStatus = async () => {
    if (id === "") {
      alert("Please create an order");
      return;
    }
    await axios
      .get(`http://127.0.0.1:8000/deliveries/${id}/status`)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const increaseBudget = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/events",
      headers: {
        "Content-Type": "text/plain",
      },
      data: {
        type: "INCREASE_BUDGET",
        delivery_id: id,
        data,
      },
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    };

  return (
    <>
      <div className="header">
        <button onClick={checkStatus}>CHECK STATUS</button>
      </div>
      <div className="container">
        <Confetti id="confetti" style={{ display: "none" }} />
        <div className="box currentbox">
          <h2>CREATE ORDER</h2>
          {first && (
            <form onSubmit={createDeliveryForm}>
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
          )}
        </div>
        <div className="box invalid">
          <h2>START ORDER</h2>
          {second && (
            <form onSubmit={startDeliveryForm}>
              <div className="form-content">
                <label htmlFor="id">ID</label>
                <input type="text" name="id" id="id" value={id} />
              </div>
              <button type="submit">START</button>
            </form>
          )}
        </div>
        <div className="box invalid">
          <h2>PICKUP DELIVERY</h2>
          {third && (
            <form onSubmit={pickupDelivery}>
              <div className="form-content">
                <label htmlFor="purchase_price">PURCHASE PRICE</label>
                <input
                  type="number"
                  name="purchase_price"
                  id="purchase_price"
                />
              </div>
              <div className="form-content">
                <label htmlFor="quantity">QUANTITY</label>
                <input type="number" name="quantity" id="quantity" />
              </div>
              <button type="submit">PICKUP DELIVERY</button>
            </form>
          )}
        </div>
        <div className="box invalid">
          <h2>DELIVER PRODUCTS</h2>
          {fourth && (
            <form onSubmit={deliverProducts}>
              <div className="form-content">
                <label htmlFor="sell_price">SELL PRICE</label>
                <input type="number" name="sell_price" id="sell_price" />
              </div>
              <div className="form-content">
                <label htmlFor="quantity">QUANTITY</label>
                <input type="number" name="quantity" id="quantity" />
              </div>
              <button type="submit">DELIVER PRODUCTS</button>
            </form>
          )}
        </div>
      </div>
      <div>
        <div className="container">
          <div className="box" style={{ alignItems: "flex-start" }}>
            <h2>INCREASE BUDGET</h2>
            <form onSubmit={increaseBudget}>
              <div className="form-content">
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" id="amount" />
              </div>
              <button type="submit">INCREASE BUDGET</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
