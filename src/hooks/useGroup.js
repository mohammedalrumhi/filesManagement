import { useState, useEffect } from "react";
import useSWR from "swr";
import { getCollectionById } from "../firebase/firebase";
// Import your Firebase function here

const useGroup = (collectionName, id) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetcher = async () => {
    setLoading(true);
    const result = await getCollectionById(collectionName, id);
    setLoading(false);

    if (result === null) {
      setError("User document does not exist");
      return null;
    }

    return result;
  };

  const { data: fileData, error: fileError } = useSWR(
    [collectionName, id],
    fetcher
  );

  useEffect(() => {
    if (fileData) {
      setData(fileData);
    }
    if (fileError) {
      setError(fileError);
    }
  }, [fileData, fileError]);

  useEffect(() => {
    if (fileData || fileError) {
      setLoading(false);
    }
  }, [fileData, fileError]);

  return { data, error, loading };
};

export default useGroup;
