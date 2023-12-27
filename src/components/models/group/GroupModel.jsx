import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./group.module.scss";
import {
  createGroup,
  getCollections,
} from "../../../firebase/firebase";
import { serverTimestamp } from "firebase/firestore";
import Select from "react-select";
function GroupModel({ isShow, setShow, setUpdateFeed, updateFeed }) {
  const [name, setName] = useState("");
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);


  const restModel = () => {
    setName("");
    setLoading(false);
    setMessage("");
    setError("");
    setSelectedOptions([]);
  };

  const handleAddGroup = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await createGroup({
        name: name,
        ids: selectedOptions,
        date: serverTimestamp(),
      });

      setMessage("تم إضافة المجموعة");
    } catch (erorr) {
      setError("خطا في إضافة المجموعة");
    }

    setLoading(false);
  };

  const handleSelectChange = (selectedValues) => {
    // selectedValues will contain the selected options
    setSelectedOptions(selectedValues);
  };

  useEffect(() => {
    const fillUsers = async () => {
      const idList = [];
      const collectionUsers = await getCollections("users");
      collectionUsers.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          idList.push({ value: doc.id, label: data.email }); // Push email to the idsList array
        }
      });

      setAllList(idList);
    };

    fillUsers();
  }, []);
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
            إضافة مجموعات
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.addUser}>
            <div className={styles.login}>
              <div className={styles.wrapperLogin}>
                <div className="container">
                  <h2> إضافة مجموعة </h2>
                  <form onSubmit={handleAddGroup} className={styles.loginForm}>
                    <div className="form-group">
                      <label htmlFor="name"> اسم المجموعة</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="اسم المجموعة"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">
                        المستخدمين المصرحين بدخول المجموعة{" "}
                      </label>
                      {allList.length > 0 && (
                        <Select
                          required
                          options={allList}
                          isMulti
                          onChange={handleSelectChange} // Set onChange to handle selected options
                          value={selectedOptions}
                        />
                      )}
                    </div>
                    {loading && (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                    {message && (
                      <div className="alert alert-success" role="alert">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      إضافة المجموعة
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* <hr />
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
          </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setUpdateFeed(!updateFeed);
              restModel();

              setShow(false);
            }}
          >
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GroupModel;
