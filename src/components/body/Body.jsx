import React, { useEffect, useState, useMemo, useContext } from "react";
import styles from "./body.module.scss";
import { Link } from "react-router-dom";
import {
  checkUserRole,
  getCollectionsWithCondition,
} from "../../firebase/firebase";
import { AuthContext } from "../../contexts/AuthContext";

const Body = ({ updateFeed }) => {
  const { currentUser } = useContext(AuthContext);

  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      //const isAdmin = await checkUserRole("users", currentUser.auth.uid);

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

  const memoizedGroups = useMemo(() => groups, [groups]);

  if (loading || memoizedGroups === null) {
    return (
      <div className={styles.progressWrapper}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  console.log(memoizedGroups);

  return (
    <div className={styles.body}>
      <div className="container text-center">
        <div className="row row-cols-4">
          {memoizedGroups.map((group, i) => (
            <div className="col mb-3" key={i}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{group.name}</h5>
                  <p className="card-text">
                 
                    مجموعة تحتوي على ملفات تتعلق بعنوانها
                  </p>

                  <Link
                    className="btn btn-primary"
                    to="/files"
                    state={{ name: group.name, id: group.id }}
                  >
                    دخول
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
