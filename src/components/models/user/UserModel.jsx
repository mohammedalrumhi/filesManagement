import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./user.module.scss";
import { createUser } from "../../../firebase/firebase";
import { serverTimestamp } from "firebase/firestore";

function UserModel({ isShow, setShow }) {
  const [userData, setUserData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    setLoading(true);
    e.preventDefault();

    createUser(userData.email, userData.password, {
      role: "user",
      date: serverTimestamp(),
    })
      .then((newUser) => {
        // Handle success
        console.log("New user created:", newUser);
        setLoading(false);
      })
      .catch((error) => {
        // Handle error
        setLoading(false);
        console.error("Error creating user:", error);
      });
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
          <Modal.Title id="example-modal-sizes-title-lg">
            إضافة مستخدم
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.addUser}>
            <div className={styles.login}>
              <div className={styles.wrapperLogin}>
                <div className="container">
                  <h2> إضافة مستخدم للطلاب</h2>
                  <form onSubmit={handleLogin} className={styles.loginForm}>
                    <div className="form-group">
                      <label htmlFor="email">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="البريد الإلكتروني"
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">كلمة المرور</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="كلمة المرور"
                        value={userData.password}
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                      />
                    </div>
                    {loading && (
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      إضافة المستخدم
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <hr />
            <div className={styles.userTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">البريد الإلكتروني</th>
                    <th scope="col">المجموعات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>oman</td>

                    <td>
                      <select
                        className="form-select"
                        multiple
                        aria-label="Multiple select example"
                      >
                        <option>إختر مجموعة أو أكثر</option>
                        <option value="1">Group 1</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            إغلاق
          </Button>
          <Button variant="primary">حفط التغيرات</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserModel;
