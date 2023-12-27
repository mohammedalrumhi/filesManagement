import React, { useContext, useState } from "react";
import styles from "./navbar.module.scss";
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
      <div className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.userControl}>
            <div className={styles.logo}>
              <img src="/logo.svg" width={70} />
            </div>
            <div className={styles.userName}>{currentUser.auth.email}</div>
          </div>

          <div className={styles["button-controls"]}>
            <button
              className={styles["controls-logout"]}
              onClick={() => setShowGroup(true)}
            >
              المجموعات <img src="/header/group.svg" alt="groups" />
            </button>

            <button
              className={styles["controls-logout"]}
              onClick={() => setShow(true)}
            >
              المستخدمين <img src="/header/users.svg" alt="users" />
            </button>

            {/* logout buttom  */}
            <button
              className={styles["controls-logout"]}
              onClick={handleLogout}
            >
              تسجيل الخروج
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
