import React, { useState } from "react";
import styles from "./home.module.scss";
import NavBar from "../../components/navbar/NavBar";
import Body from "../../components/body/Body";
const Home = () => {

  const [updateFeed, setUpdateFeed] = useState(false);

  return (
    <>
      <div className={styles.home}>
        <NavBar
    
          setUpdateFeed={setUpdateFeed}
          updateFeed={updateFeed}
        />
        <Body updateFeed={updateFeed} />
      </div>
    </>
  );
};

export default Home;
