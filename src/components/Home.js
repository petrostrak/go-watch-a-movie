import React, {Component} from "react";
import "./Home.css";
import Ticket from "./../images/movie_tickets.jpg";

export default class Home extends Component {
    
    render() {
        return (
            <div className="text-center">
                <h2>Welcome to Go-Movies!</h2>
                <hr />
                <img src={Ticket} alt="movie ticket" />
                <hr />
                <div className="tickets">

                </div>
            </div>
        );
    }
}