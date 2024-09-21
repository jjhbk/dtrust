// components/VoteModal.js
import React, { useState } from "react";

const VoteModal = ({ closeModal }: any) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(false);
  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle file submission logic
    console.log("File uploaded:", selectedFile);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Upload Image for Vote</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-4 border rounded" />
          <div className="flex flex-col">
            {<label className="mb-2 text-sm font-medium text-gray-700">Vote Result</label>}
            <select
              value={String(result)}
              onChange={e => {
                setResult(e.target.value === "true");
              }}
              className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={String(true)}>True</option>
              <option value={String(false)}>False</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">
              Selected Value: <strong>{String(result) ? "True" : "False"}</strong>
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoteModal;
