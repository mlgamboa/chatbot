import axios from "axios";
let apiRegistry = {};
export default async function performAction(req, res) {
  try {
    const { apiName, path, method, parameters } = req.body;
    const api = apiRegistry[apiName];
    
    const response = await axios({
      method,
      url: `${api.spec.servers[0].url}${path}`,
      [method.toLowerCase() === "get" ? "params" : "data"]: parameters
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
}