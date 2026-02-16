import { apiClient } from "../../../services/apiClient";


const getTrendingAuthors = async () => {
    const { data } = await apiClient.get("/author/trending-authors");
    return data;
  };
  
  export { getTrendingAuthors };

const getTrendingTopics = async () => {
    const { data } = await apiClient.get("/author/trending-topics");
    return data;
  };
  
  export { getTrendingTopics };

  