import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvengersList = () => {
  const [avengers, setAvengers] = useState([]); // State to hold the avengers data

  useEffect(() => {
    // Function to fetch avengers data from the backend
    const fetchAvengers = async () => {
      try {
        const response = await axios.get('/avengers'); // Make a GET request to the backend
        setAvengers(response.data); // Update state with fetched data
      } catch (error) {
        console.error("There was an error fetching the avengers!", error); // Log error if any
      }
    };

    fetchAvengers(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once when component mounts

  return (
    <div>
      <h1>Avengers List</h1>
      <ul>
        {avengers.map(avenger => (
          <li key={avenger.id}>{avenger.name} - {avenger.superpower}</li>
        ))}
      </ul>
    </div>
  );
};

export default AvengersList;