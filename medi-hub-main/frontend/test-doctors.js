// Simple test to check for BSON errors
fetch('http://localhost:8000/api/v1/user/alldoctors')
  .then(response => response.json())
  .then(data => {
    console.log('Doctors data:', data);
    console.log('Number of doctors:', data.data.length);
  })
  .catch(error => {
    console.error('Error fetching doctors:', error);
  });