import axios from "axios";

export const fetchUserProjects = async (userId: string) => {
    const { data } = await axios.post('/api/getUserProjects', { userId });
    return data.data;
  };

  
