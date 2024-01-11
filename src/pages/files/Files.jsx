import React, { useCallback, useRef, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { handleFileUpload } from "../../firebase/firebase";
import useGroup from "../../hooks/useGroup";
import useFiles from "../../hooks/useFiles";
import { checkFileType } from "../../helper/CheckFile";
import { useDropzone } from "react-dropzone";
const Files = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [updateFeed, setUpdateFeed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data: mygroup, error, loading } = useGroup("groups", groupId);
  const {
    data: filesData,
    error: filesError,
    loading: filesLoading,
    mutateData,
  } = useFiles(groupId);

  const onDrop = useCallback(async (acceptedFiles) => {
    await handleFileUpload(acceptedFiles, groupId, handleUploadProgress);

     mutateData();
    setUploadProgress(0);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar setUpdateFeed={setUpdateFeed} updateFeed={updateFeed} />
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full border-t-2 border-b-2 border-gray-900 h-8 w-8"></div>
              <span className="mt-2">الرجاء الإنتظار...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-4">
            <div className="bg-coolGray-200 rounded-lg flex justify-between items-center px-4 py-2">
              <button
                className="bg-white rounded-full p-2"
                onClick={() => navigate("/")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-xl">مجموعة : {mygroup.name}</div>
              <div></div> {/* Empty space for space-between */}
            </div>

            <div className="flex flex-wrap justify-center mt-4 w-full">
              {filesData?.map((file, i) => (
                <div className="flex flex-col items-center m-3" key={i}>
                  <div className="border rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: checkFileType(file.name),
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-40 overflow-hidden h-6">
                      <p className="whitespace-no-wrap text-ellipsis">
                        {file.name}
                      </p>
                    </div>
                    <div className="w-full items-center ">
                      <a href={file.path} target="__blank">
                        تنزيل
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <div className="border-dotted border-4 p-6 mt-3 w-56">
                    <div className="w-40 overflow-hidden">
                      <p className="whitespace-no-wrap text-center">
                        إضافة ملف جديد
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20">
                        {uploadProgress > 0 ? (
                          <div className="flex items-center justify-center">
                            <div className="w-24 h-24 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
                            <div className="absolute flex items-center justify-center w-24 h-24">
                              <span className="text-4xl font-bold">
                                {Math.floor(uploadProgress)}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src="/header/add.svg"
                            alt="Add File"
                            className="w-full h-full cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div
                className="flex flex-col items-center m-3 cursor-pointer "
                key="add-file"
                onClick={() => handleAddFile()}
              >
                <div className="border-dotted border-4 p-4 w-56">
                  <div className="w-40 overflow-hidden">
                    <p className="whitespace-no-wrap text-center">
                      إضافة ملف جديد
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-20 h-20">
                      {uploadProgress > 0 ? (
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-24 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
                          <div className="absolute flex items-center justify-center w-24 h-24">
                            <span className="text-4xl font-bold">
                              {Math.floor(uploadProgress)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src="/header/add.svg"
                          alt="Add File"
                          className="w-full h-full cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Files;
