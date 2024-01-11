import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  getCollectionsWithCondition,
  getCollectionById,
} from "../../firebase/firebase";
import { AuthContext } from "../../contexts/AuthContext";
import EditGroup from "../models/editGroup/editGroup";

const Body = ({ updateFeed }) => {
  const { currentUser } = useContext(AuthContext);

  const [groups, setGroups] = useState(null);
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const groupsCollection = await getCollectionsWithCondition(
          "groups",
          currentUser.auth.uid
        );
        setGroups(groupsCollection);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateFeed, currentUser.auth.uid]);

  const handleEditGroup = async (id) => {
    const group = await getCollectionById("groups", id);

    setEditedGroup(group);
    setGroupId(id);
    setIsEditGroupOpen(true);
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
                  className="block w-full mt-4 px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition duration-300"
                  to={`/files/${group.id}`}
                >
                  دخول
                </Link>
                <div className="flex justify-end mt-4">
                  <img
                    className="w-6 h-6 cursor-pointer"
                    src="/header/edit.svg"
                    alt="Edit icon"
                    onClick={() => handleEditGroup(group.id)}
                  />
                </div>
              </div>
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
