import React from 'react';
import { Link } from 'react-router-dom';
import Productos from './Productos';
import Navbar from './Navbar';

export default function Home() {
    return (
        <div>   
            <Navbar />
            <br></br>
            <Productos />

        </div>
    );
}
