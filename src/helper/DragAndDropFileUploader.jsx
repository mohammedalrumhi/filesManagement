import React, { useState, useRef } from "react";
import "./drag.scss";
import { handleFileUpload } from "../firebase/firebase";
const DragAndDropFileUploader = ({ id, setDone }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress); // Assuming you have state for upload progress
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = [...e.dataTransfer.files];
    setFiles(droppedFiles);
    // Process the dropped files (e.g., upload or handle them)
    // You can add your logic here to handle the dropped files
    await handleFileUpload(droppedFiles, id, handleUploadProgress);
    setDone(true);
  };

  const handleFileInputChange = async (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);
    // Process the selected files (e.g., upload or handle them)
    // You can add your logic here to handle the selected files
    await handleFileUpload(selectedFiles, id, handleUploadProgress);
    setDone(true);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div
        className={`drag-drop-container ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button onClick={openFileDialog}>أختر ملف </button>
        <p>اسقط هنا الملف</p>
        <div>
          {files.map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
        </div>
      </div>
      <div className="progress-container">
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              aria-label="Example with label"
              style={{ width: `${uploadProgress}%` }} // Dynamically setting width
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {Math.floor(uploadProgress)} %
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        ref={fileInputRef}
      />
    </div>
  );
};

export default DragAndDropFileUploader;
