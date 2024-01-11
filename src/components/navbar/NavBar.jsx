import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import UserModel from "../models/user/UserModel";
import GroupModel from "../models/group/GroupModel";

const NavBar = ({ setUpdateFeed, updateFeed }) => {
  const { dispatch, currentUser } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="mr-4">
              <img src="/logo.svg" width={70} alt="Logo" />
            </div>
            <div>{currentUser.auth.email}</div>
          </div>

          <div className="flex items-center">
            <button
              className="mr-4 flex items-center"
              onClick={() => setShowGroup(true)}
            >
              <span className="mr-1">المجموعات</span>
              <img src="/header/group.svg" alt="groups" />
            </button>

            <button
              className="mr-4 flex items-center"
              onClick={() => setShow(true)}
            >
              <span className="mr-1">المستخدمين</span>
              <img src="/header/users.svg" alt="users" />
            </button>

            <button className="flex items-center" onClick={handleLogout}>
              <span className="mr-1">تسجيل الخروج</span>
              <img src="/header/logout.svg" alt="logout" />
            </button>
          </div>
        </div>
      </div>

      <UserModel isShow={show} setShow={setShow} />
      <GroupModel
        isShow={showGroup}
        setShow={setShowGroup}
        setUpdateFeed={setUpdateFeed}
        updateFeed={updateFeed}
      />
    </>
  );
};

export default NavBar;
