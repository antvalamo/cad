import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import sampleImage from './images/htwg.jpg';

function App() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('content', content);
    formData.append('tags', tags);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        alert('File uploaded successfully.');
      } else {
        console.error('Error uploading file. Status:', response.status);
        alert('Error uploading file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. See the console for more details.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error while searching for files:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#3498db', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="form-container" style={{ backgroundColor: '#3498db', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
        <img src={sampleImage} alt="Sample" style={{ width: '200px', margin: '0 auto 20px auto' }} />
        <h1 className="upload-heading">Upload media files</h1>
        <div className="form-group">
          <input
            type="file"
            id="fileInput"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nameInput" className="label">Name:</label>
          <input
            type="text"
            id="nameInput"
            className="input-field"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contentInput" className="label">Content:</label>
          <input
            type="text"
            id="contentInput"
            className="input-field"
            placeholder="Enter content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tagsInput" className="label">Tags:</label>
          <input
            type="text"
            id="tagsInput"
            className="input-field"
            placeholder="Enter tags (separated by commas)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button className="upload-button" onClick={handleUpload}>Upload file</button>
        <div className="search-section" style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
          {results.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid white', backgroundColor: '#3498db', color: 'white', padding: '12px' }}>Name</th>
                  <th style={{ border: '1px solid white', backgroundColor: '#3498db', color: 'white', padding: '12px' }}>Content</th>
                  <th style={{ border: '1px solid white', backgroundColor: '#3498db', color: 'white', padding: '12px' }}>Tags</th>
                  <th style={{ border: '1px solid white', backgroundColor: '#3498db', color: 'white', padding: '12px' }}>Creation Date</th>
                  <th style={{ border: '1px solid white', backgroundColor: '#3498db', color: 'white', padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td style={{ border: '1px solid white', padding: '12px' }}>{result.name}</td>
                    <td style={{ border: '1px solid white', padding: '12px' }}>{result.content}</td>
                    <td style={{ border: '1px solid white', padding: '12px' }}>{result.tags}</td>
                    <td style={{ border: '1px solid white', padding: '12px' }}>{new Date(result.created_at).toLocaleString()}</td>
                    <td style={{ border: '1px solid white', padding: '12px' }}>
                      <a href={`http://localhost:5000/download/${result.filename}`} download>
                        <button style={{ backgroundColor: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease', fontSize: '12px' }}>Download</button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
