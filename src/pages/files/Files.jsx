import React, { useEffect, useState } from "react";
import styles from "./files.module.scss";
import NavBar from "../../components/navbar/NavBar";
import { useLocation } from "react-router-dom";
import DragAndDropFileUploader from "../../helper/DragAndDropFileUploader";
import { getDataByGroupId } from "../../firebase/firebase";
const Files = () => {
  const location = useLocation();

  const name = location.state?.name || "";
  const id = location.state?.id || "";
  const [updateFeed, setUpdateFeed] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getFiles = async () => {
      try {
        const querySnapshot = await getDataByGroupId(id);
        const newData = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          // Process your data here
          newData.push({ id: doc.id, ...doc.data() });
        });

        setFileList(newData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    getFiles();
  }, [done]);

  const handleAddFile = () => {
    console.log("upload file");
  };

  return (
    <>
      <div className={styles.home}>
        <NavBar setUpdateFeed={setUpdateFeed} updateFeed={updateFeed} />
        {loading ? (
          <div className={styles.progressWrapper}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className={styles.files}>
            <div className={styles.pageName}>
              مجموعة : {name} - {id}
            </div>
            {loading}
            <div className={styles.fileContainer}>
              {fileList.length > 0 ? (
                <div>
                  <div className={styles.body}>
                    <div className="container text-center">
                      <div className="row row-cols-4">
                        {fileList.map((file, i) => (
                          <div className="col mb-3" key={i}>
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">{file.name}</h5>
                                <p className="card-text">هذا ملف</p>
                                <div className={styles.cardContent}>
                                  <img
                                    src={file.path}
                                    alt="file"
                                    width={100}
                                    height={100}
                                  />

                                  <a href={file.path}>تنزيل</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="col mb-3">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title"></h5>
                              <p className="card-text"> اضافة ملف</p>
                              <div className={styles.addCard}>
                                <img
                                  src="/header/add.svg"
                                  width={70}
                                  height={100}
                                  onClick={handleAddFile}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <DragAndDropFileUploader id={id} setDone={setDone} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Files;
