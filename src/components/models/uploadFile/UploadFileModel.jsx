import { useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { handleFileUpload } from "../../../firebase/firebase";

function UploadFileModel({ isShow, setShow, groupId, update }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  const handleFileChange = useCallback(
    (e) => {
      e.preventDefault();
      setSelectedFile(e.target.files);
    },
    [setSelectedFile]
  );

  const handleAddFile = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await handleFileUpload(selectedFile, groupId, handleUploadProgress, name);
      update();
    } catch (error) {
      setError(error.message);
      console.log(error.message);

      setLoading(false);
    }

    setMessage("تم رفع الملف بنجاح");
    setName("");
    setSelectedFile([]);
    setLoading(false);
  };
  return (
    <>
      <Modal
        size="lg"
        show={isShow}
        onHide={() => setLgShow(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">اسم الملف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form
              onSubmit={handleAddFile}
              className="flex flex-col flex-shrink gap-3"
            >
              <div className="form-group ">
                <input
                  required
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  placeholder="اسم الملف"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group ">
                <input
                  required
                  type="file"
                  className="form-control"
                  id="file"
                  placeholder="الملف"
                  onChange={handleFileChange}
                />
              </div>
              {loading && (
                <div className="relative h-8 bg-gray-200 rounded">
                  <div
                    className="absolute top-0 left-0 bg-green-500 rounded h-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                رفع الملف
              </button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UploadFileModel;
