import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { getDataByGroupId } from "../firebase/firebase";

const useFiles = (groupId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetcher = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDataByGroupId(groupId);
      const filesData = querySnapshot.docs.map((doc) => doc.data());
      setLoading(false);
      return filesData;
    } catch (error) {
      setLoading(false);
      setError("Error getting documents: " + error.message);
      console.error("Error getting documents: ", error);
      return null;
    }
  };

  const { data: filesData, error: filesError } = useSWR(
    groupId ? ["files", groupId] : null,
    fetcher
  );

  useEffect(() => {
    if (filesData) {
      setData(filesData);
    }
    if (filesError) {
      setError(filesError);
    }
  }, [filesData, filesError]);

  useEffect(() => {
    if (filesData || filesError) {
      setLoading(false);
    }
  }, [filesData, filesError]);

  const updateData = async () => {
    try {
      const updatedData = await getDataByGroupId(groupId); // Fetch updated data
      const filesData = updatedData.docs.map((doc) => doc.data());
      setData(filesData); // Update the data state
      mutate(["files", groupId], filesData, false);
      // Update the SWR cache without revalidating
      console.log("called mutue from useFiles");
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  return { data, error, loading, mutateData: updateData };
};

export default useFiles;
