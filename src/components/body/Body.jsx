import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  getCollectionsWithCondition,
  getCollectionById,
} from "../../firebase/firebase";
import { AuthContext } from "../../contexts/AuthContext";
import EditGroup from "../models/editGroup/EditGroup";

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
                  className="inline-block px-4 py-2 border border-black rounded text-black hover:scale-105"
                  to={`/files/${group.id}`}
                >
                  دخول
                </Link>
                <div className="flex justify-end mt-4">
                  <svg
                    onClick={() => handleEditGroup(group.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
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
