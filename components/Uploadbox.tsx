import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes: string[] = ["JPG", "PNG", "GIF", "MP4", "MP3"];



function Uploadbox() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    filename: "",
    title: "",
    description: "",
    tags: "",
    mediaType: "IMAGE", // Default media type is "image"
  });


  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    console.log("selected file:", selectedFile);

    if (selectedFile) {
      // Log the selected file's name
      console.log("Selected File Name:", selectedFile.name);
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        filename: selectedFile.name,
        mediaType: selectedFile.type,
      }));
    }
  };

  const handleMetadataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [name]: value,
    }));
  };

  const handleFileUpload = () => {
    if (!file) {
      console.log("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("filedata", file);
    formData.append("filename", metadata.filename);
    formData.append("title", metadata.title);
    formData.append("description", metadata.description);
    formData.append("tags", metadata.tags);
  
    formData.append("mediaType", metadata.mediaType);
  
    formData.forEach(function (value, key) {
      console.log(key, value);
    });

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage("File uploaded successfully!");
          setErrorMessage(null);
        } else {
          setErrorMessage("Error uploading file");
          setSuccessMessage(null);
        }
      })
      .catch((error) => {
        setErrorMessage("Error uploading file");
        setSuccessMessage(null);
        console.error("Error uploading file:", error);
      });
  };
  

  return (
    <div className="bg-gray-400 bg-opacity-20 p-4 text-center">
      <strong>Deposit a file</strong>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form>
        <div className="mb-4">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={metadata.title}
            onChange={handleMetadataChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Description:</label>
          <textarea
            name="description"
            value={metadata.description}
            onChange={handleMetadataChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={metadata.tags}
            onChange={handleMetadataChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        </div>
        <button
          type="button"
          onClick={handleFileUpload}
          className="bg-green-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Upload File
        </button>
      </form>
    </div>
  );
}

export default Uploadbox;
