import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import UserModel from "../models/user/UserModel";
import GroupModel from "../models/group/GroupModel";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setUpdateFeed, updateFeed }) => {
  const toPage = useNavigate();
  const { dispatch, currentUser } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const isAdmin = currentUser.user.role === "admin";

  const handleLogout = async () => {
    await auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 supports-backdrop-blur:bg-white/90 dark:bg-slate-900/75">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="mr-4" onClick={() => toPage("/")}>
              <img src="/logo.svg" width={70} alt="Logo" />
            </div>

    
          </div>

          <div className="flex items-center gap-7 md:gap-4">
            {isAdmin && (
              <>
                <button
                  className="mr-4 flex items-center gap-2"
                  onClick={() => setShowGroup(true)}
                >
                  <span className=" hidden md:block mr-1">المجموعات</span>
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
                      d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
                    />
                  </svg>
                </button>
                <button
                  className="mr-4 flex items-center gap-2"
                  onClick={() => setShow(true)}
                >
                  <span className="hidden md:block mr-1">المستخدمين</span>
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
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                </button>
              </>
            )}

            <button className="flex items-center gap-2" onClick={handleLogout}>
              <span className="hidden md:block mr-1">تسجيل الخروج</span>
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
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
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
