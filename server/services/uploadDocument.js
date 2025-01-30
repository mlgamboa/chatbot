import { promises as fs } from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js'; // Use direct path

export default async function uploadDocument(req, res) {
  try {
    if (!req.file) throw new Error('No file uploaded');
    
    // Read uploaded file
    const dataBuffer = await fs.readFile(req.file.path);
    
    // PDF processing
    let textContent;
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(dataBuffer);
      textContent = data.text;
    } else {
      textContent = dataBuffer.toString('utf-8');
    }

    // Save processed text
    await fs.writeFile(
      `uploads/documents/${Date.now()}-${req.file.originalname}.txt`,
      textContent
    );

    res.json({ success: true, filename: req.file.originalname });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      systemError: error.code === 'ENOENT' ? 'File path error' : 'Processing error'
    });
  }
}