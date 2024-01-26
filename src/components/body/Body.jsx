import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  getCollectionsWithCondition,
  getCollectionById,
  deleteDocumentById,
} from "../../firebase/firebase";
import { AuthContext } from "../../contexts/AuthContext";
import EditGroup from "../models/editGroup/EditGroup";
import useGroups from "../../hooks/useGroups";
import ConfirmModel from "../models/confirmation/ConfirmModel";

const Body = ({ updateFeed }) => {
  const { currentUser } = useContext(AuthContext);

  // const [groups, setGroups] = useState(null);
  const [groupId, setGroupId] = useState("");
  // const [loading, setLoading] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { groups, loading, error, refreshGroups } = useGroups(
    "groups",
    currentUser.auth.uid
  );

  const noGroups = groups?.length === 0;

  const handleEditGroup = async (id) => {
    const group = await getCollectionById("groups", id);

    setEditedGroup(group);
    setGroupId(id);
    setIsEditGroupOpen(true);
    updateFeed(true);
  };

  const handleDeleteGroup = async (id) => {
    console.log("fire handle delete");
    await deleteDocumentById("groups", id);

    refreshGroups();
  };

  const memoizedGroups = useMemo(() => groups, [groups]);

  if (loading || memoizedGroups === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (noGroups) {
    return (
      <div className="flex justify-center items-center h-screen">
        لا يوجد مجموعة حتى الآن
      </div>
    );
  }

  return (
    <>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memoizedGroups.map((group, i) => (
            <div
              className="bg-white rounded-md shadow-md overflow-hidden"
              key={i}
            >
              <div className="p-4">
                <h5 className="text-lg font-bold mb-2">{group.name}</h5>
                <p className="text-gray-600">
                  مجموعة تحتوي على ملفات تتعلق بعنوانها
                </p>
                <Link
                  className="inline-block px-4 py-2 border border-black rounded text-black hover:scale-105"
                  to={`/files/${group.id}`}
                >
                  دخول
                </Link>
                <div className="flex  gap-2 justify-end mt-4">
                  <svg
                    onClick={() => handleEditGroup(group.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <svg
                    onClick={() => setShowConfirmation(true)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
              </div>
              {showConfirmation && (
                <ConfirmModel
                  isShow={showConfirmation}
                  setShow={setShowConfirmation}
                  deleteFucntion={() => handleDeleteGroup(group.id)}
                  update={() => refreshGroups()}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {editedGroup !== null && isEditGroupOpen === true && (
        <EditGroup
          isShow={isEditGroupOpen}
          setShow={setIsEditGroupOpen}
          editedGroup={editedGroup}
          groupId={groupId}
        />
      )}
    </>
  );
};

export default Body;
