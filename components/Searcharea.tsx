import React, { useState } from "react";

// Define an interface for the document type
interface Document {
  id: number;
  title: string;
  file_path: string;
  tags: string;
  filename: string;
  description: string;
  mediaType: string;
  preffix:string;
  created_at:string;
}

function DocumentSearch() {
  const [searchArgument, setSearchArgument] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("title"); // Default search criteria
  const [searchResults, setSearchResults] = useState<Document[]>([]);

  const handleSearch = async () => {
    try {
      // Send a request to your backend to search for documents based on searchTerm and searchCriteria
      const response = await fetch(`/api/search?argument=${searchArgument}&searchCriteria=${searchCriteria}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        console.error('Failed to fetch search results.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (fileId:number) => {
    try {
      // Send a request to your backend to delete the file
      console.log("here", fileId);
      const response = await fetch(`/api/operation?fileId=${fileId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // If the file is successfully deleted, remove it from the search results
        const updatedResults = searchResults.filter((result) => result.id !== fileId);
        setSearchResults(updatedResults);
      } else {
        console.error("Failed to delete the file.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDownload = (filepath: string) => {
    // Trigger a download for the selected file using its ID
    window.location.href = `/api/operation?filepath=${filepath}`;
  };

  return (
    <div>
      <div className="mb-4 bg-gray-500 bg-opacity-20 p-6 rounded">
        <strong className="text-center">Document Search</strong>
        <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-3/4">
            <input
              type="text"
              placeholder="Search ..."
              value={searchArgument}
              onChange={(e) => setSearchArgument(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="w-full md:w-1/4">
            <select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="media_type">Filetype</option>
              <option value="filename">Filename</option>
              <option value="tags">Tags</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 bg-gray-500 bg-opacity-20 rounded">
          <strong className="text-center">Search Results</strong>
          {searchResults.length === 0 ? (
            <strong className="text-center">No results found</strong>
          ) : (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((result, index) => (
                <div key={index} className="border border-black p-4 rounded">
                  <div>
                    <strong>Title:</strong> {result.title}
                  </div>
                  <div>
                    <strong>Description:</strong> {result.description}
                  </div>
                  <div>
                    <strong>Filename:</strong>{" "}
                    {result.filename.substring(result.preffix.length)}
                  </div>
                  <div>
                    <strong>Tags:</strong> {result.tags}
                  </div>
                  <div>
                    <strong>Media Type:</strong> {result.mediaType}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(result.file_path)}
                      className="bg-green-400 text-white px-2 py-2 rounded mt-2"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(result.id)}
                      className="bg-red-400 text-white px-2 py-2 rounded mt-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentSearch;
