import { apiClient } from "../../../services/apiClient";


const getTrendingAuthors = async () => {
    console.log("Fetching trending authors");
    const { data } = await apiClient.get("/author/trending-authors");
    return data;
  };
  
  export { getTrendingAuthors };

const getTrendingTopics = async () => {
    console.log("Fetching trending topics");
    const { data } = await apiClient.get("/author/trending-topics");
    return data;
  };
  
  export { getTrendingTopics };

  