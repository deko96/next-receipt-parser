import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { colors } from "@mui/material";

const FullScreenDragAndDropUploader = ({ onFileDrop }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setLoading(true);
      await onFileDrop(file);
      setLoading(false);
    }
  };

  const handleOpenFilePicker = () => {
    // Trigger the native file picker when the component is clicked
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ""; // Define your accepted file types here if needed
    fileInput.style.display = "none";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        await onFileDrop(file);
        setLoading(false);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: dragging ? "#f0f0f0" : "#ffffff",
        border: `2px dashed ${dragging ? "#aaaaaa" : "#cccccc"}`,
        cursor: "pointer",
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOpenFilePicker}
    >
      {loading ? (
        <CircularProgress size={64} color="primary" />
      ) : (
        <CloudUploadIcon
          color={dragging ? "secondary" : "primary"}
          style={{
            fontSize: "64px",
          }}
        />
      )}
      <p
        style={{
          textAlign: "center",
          fontSize: "24px",
          color: "#333333",
        }}
      >
        {loading
          ? "Uploading..."
          : dragging
          ? "Drop the file here"
          : "Click or drag and drop a file"}
      </p>
    </div>
  );
};

export default FullScreenDragAndDropUploader;
