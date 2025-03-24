// AttendantService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/attendant';

const getAttendants = () => axios.get(API_URL);
const createAttendant = (attendant) => axios.post(API_URL, attendant);
const updateAttendant= (attendant) => axios.put(API_URL, attendant);
const deleteAttendant = (id) => axios.delete(`${API_URL}/${id}`);

export { getAttendants, createAttendant, updateAttendant, deleteAttendant };
