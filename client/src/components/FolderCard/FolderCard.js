import "./FolderCard.css";

import folderIcon from "../../assets/folder-icon.png";

export default function FolderCard({ selectedFolder, folder }) {
  return (
    <div className="folder-card">
      <img src={folderIcon} alt={folder} />
      <p
        style={{
          color: selectedFolder === folder ? "#027ff7" : "#404040",
        }}
        className="folder-name"
      >
        {folder}
      </p>
    </div>
  );
}
