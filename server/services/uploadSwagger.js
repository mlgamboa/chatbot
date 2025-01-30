import * as SwaggerParser from 'swagger-parser';

let apiRegistry = {};

export default async function uploadSwagger(req, res) {
  try {
    const api = await SwaggerParser.parse(req.file.path);
    apiRegistry[api.info.title] = {
      spec: api,
      filePath: req.file.path
    };
    res.json({ apis: Object.keys(apiRegistry) });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
}