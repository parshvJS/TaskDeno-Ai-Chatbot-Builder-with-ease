import axios from "axios";

export const fetchUserProjects = async (userId: string) => {
    const { data } = await axios.post('/api/getUserProjects', { userId });
    if(data.statusCode==201){
      return 201;
    }
    else{
      return data.data;
    }
  };

  
