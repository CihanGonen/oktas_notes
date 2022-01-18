import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { storage } from "../../firebase/config";
import CryptoJS from "crypto-js";
import axios from "axios";

import "./AddFile.css";

import FolderCard from "../FolderCard/FolderCard";
// import ProgressBar from "@ramonak/react-progress-bar";
import uploadIcon from "../../assets/upload.png";

import { useNavigate } from "react-router-dom";

import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

export default function AddFile({
  folders,
  listFolders,
  gettingFolders,
  listFile,
}) {
  const reader = new FileReader();

  const [foldersAndFiles, setFoldersAndFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  // const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!gettingFolders) {
      setLoading(true);
      folders.forEach((folder) => {
        const urls = listFile(`${user.uid}/${folder}`);
        setFoldersAndFiles((prevFoldersAndFiles) => {
          return [...prevFoldersAndFiles, { folder, urls }];
        });
      });
    }
    setLoading(false);
  }, [gettingFolders, folders, listFile, user.uid]);

  const encryptFile = (file) => {
    console.log(file);
    let time = +new Date();
    time = String(time);
    var shahash = CryptoJS.SHA256(time);
    let shahashString = shahash.words.reduce((a, b) => String(a) + String(b));
    var md5hash = CryptoJS.MD5(shahashString);
    let md5hashString = md5hash.words.reduce((a, b) => String(a) + String(b));
    if (file.type === "text/plain") {
      reader.readAsText(file);
      reader.addEventListener(
        "load",
        () => {
          let innerTxt = reader.result;
          var encryptedAES = CryptoJS.AES.encrypt(innerTxt, md5hashString);
          var decryptedBytes = CryptoJS.AES.decrypt(
            encryptedAES,
            md5hashString
          );
          let str = decryptedBytes.toString();
          var f = new File(
            ["T" + str],
            `${file.name.slice(0, file.name.indexOf("."))}.txt`,
            {
              type: "text/plain",
              lastModified: new Date(),
            }
          );
          uploadFiles(f);
        },
        false
      );
    } else {
      reader.readAsDataURL(file);
      reader.addEventListener(
        "load",
        () => {
          let innerTxt = reader.result;
          console.log(innerTxt);
          var encryptedAES = CryptoJS.AES.encrypt(innerTxt, md5hashString);
          var decryptedBytes = CryptoJS.AES.decrypt(
            encryptedAES,
            md5hashString
          );
          let str = decryptedBytes.toString();
          var f = new File(
            ["G" + str],
            `${file.name.slice(0, file.name.indexOf("."))}.txt`,
            {
              type: "text/plain",
              lastModified: new Date(),
            }
          );
          uploadFiles(f);
        },
        false
      );
    }
  };

  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    if (!selectedFolder) {
      setUploadError("lütfen dosyanın yükleneceği klasörü seçiniz");
      return;
    } else if (!file.type.includes("image") && !file.type === "text/plain") {
      setUploadError("lütfen bir görsel veya txt dosyası seçiniz");
      return;
    }
    setUploadError("");
    encryptFile(file);
  };

  const uploadFiles = (file) => {
    console.log("file in uploadFiles ", file);
    //
    if (!file) return;
    const storageRef = ref(
      storage,
      `${user.uid}/${selectedFolder}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgress(prog);
      },
      (err) => console.log(err.message),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
      }
    );
    setUploadError("");
    setSelectedFolder("");
    setSelectedFile("");
  };

  const onKlasorSubmit = (e) => {
    e.preventDefault();
    setSelectedFolder(folderName);
    setFolderName("");
  };

  return (
    <div className="add-file">
      <h3>Dosya Yükle</h3>
      <div className="my-hr"></div>
      <h4>Klasör Seç</h4>
      <div className="folder-card-wrapper">
        {loading && "loading..."}
        {!loading &&
          folders.map((folder) => (
            <button
              key={folder.folder}
              className="btn-foldercard"
              onClick={() => setSelectedFolder(folder)}
            >
              <FolderCard selectedFolder={selectedFolder} folder={folder} />
            </button>
          ))}
      </div>
      <div className="klasorForm">
        <form onSubmit={onKlasorSubmit}>
          <label style={{ fontSize: "18px" }}>
            <h4>Klasör Ekle</h4>
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              style={{ marginLeft: ".5rem" }}
              type="text"
            ></input>
          </label>
          <button type="submit" className="btn btn-klasor">
            ekle
          </button>
        </form>
      </div>
      <div className="eklenecek-klasor">
        <h5 style={{ fontSize: "18px" }}>Eklenecek Klasör :</h5>
        <p> {selectedFolder}</p>
      </div>

      <form onSubmit={formHandler}>
        <label className="file-upload-label">
          <input
            placeholder="dosya seç"
            onChange={(e) => setSelectedFile(e.target.value)}
            type="file"
          />
          <p>{selectedFile.substring(selectedFile.lastIndexOf("\\") + 1)}</p>
          <img width="15px" height="15px" src={uploadIcon} alt="upload" />
        </label>
        <button className="btn btn-upload" type="submit">
          <img width="20px" height="20px" src={uploadIcon} alt="upload" />
          Yükle
        </button>
      </form>
      {uploadError && (
        <p style={{ fontSize: "13px", color: "red" }}>{uploadError}</p>
      )}

      {/* <div className="progress-wrapper">
        <ProgressBar style={{ height: "10px" }} completed={progress} />
      </div> */}
    </div>
  );
}
