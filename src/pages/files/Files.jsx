import React, { useCallback, useContext, useRef, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { deleteFile } from "../../firebase/firebase";
import useGroup from "../../hooks/useGroup";
import useFiles from "../../hooks/useFiles";
import { checkFileType } from "../../helper/CheckFile";
import UploadFileModel from "../../components/models/uploadFile/UploadFileModel";
import ConfirmModel from "../../components/models/confirmation/ConfirmModel";
import { AuthContext } from "../../contexts/AuthContext";
const Files = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [updateFeed, setUpdateFeed] = useState(false);
  const [isFileNameOpen, setIsFileNameOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: mygroup, error, loading } = useGroup("groups", groupId);
  const {
    data: filesData,
    error: filesError,
    loading: filesLoading,
    mutateData,
  } = useFiles(groupId);

  const { currentUser } = useContext(AuthContext);

  const isAdmin = currentUser.user.role === "admin";

  const handleDeleteFile = async (fileId, groupId) => {
    console.log("fire handle delete");
    await deleteFile(fileId, groupId);

    mutateData();
    setShowConfirmation(false);
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
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
              </button>
              <div className="text-xl">مجموعة : {mygroup.name}</div>
              <div></div> {/* Empty space for space-between */}
            </div>

            <div className="flex flex-wrap justify-center mt-4 w-full">
              {filesData && filesData.length > 0 ? (
                filesData?.map((file, i) => (
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
                          {file.title}
                        </p>
                      </div>
                      <div className="flex gap-2  mx-auto">
                        <a href={file.path} target="__blank">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#000000"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </a>

                        {isAdmin && (
                          <svg
                            onClick={() => setShowConfirmation(true)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {showConfirmation && (
                      <ConfirmModel
                        isShow={showConfirmation}
                        setShow={setShowConfirmation}
                        deleteFucntion={() =>
                          handleDeleteFile(file.id, file.groupUid)
                        }
                        update={mutateData}
                      />
                    )}
                  </div>
                ))
              ) : !isAdmin ? (
                <p>لا يوجد ملفات حتى الآن</p>
              ) : null}
              {isAdmin && (
                <div onClick={() => setIsFileNameOpen(true)}>
                  <div className="border-dotted border-4 p-6 mt-3 w-56">
                    <div className="w-40 overflow-hidden">
                      <p className="whitespace-no-wrap text-center">
                        إضافة ملف جديد
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-20 h-20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isFileNameOpen && (
        <UploadFileModel
          isShow={isFileNameOpen}
          setShow={setIsFileNameOpen}
          groupId={groupId}
          update={mutateData}
        />
      )}
    </>
  );
};

export default Files;
