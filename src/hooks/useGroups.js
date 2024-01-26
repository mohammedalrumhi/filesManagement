import useSWR, { mutate } from 'swr';
import { getCollectionsWithCondition } from '../firebase/firebase';

const fetchGroups = async (url) => {
  try {
    const groupsCollection = await getCollectionsWithCondition(url.collectionName, url.uid);
    return groupsCollection;
  } catch (error) {
    throw error;
  }
};

const useGroups = (collectionName, uid) => {
  const { data: groups, error } = useSWR(
    { collectionName, uid },
    fetchGroups
  );

  const loading = !groups && !error;

  const refreshGroups = async () => {
    // Trigger a re-fetch manually using mutate
    mutate({ collectionName, uid });
  };

  return { groups, loading, error, refreshGroups };
};

export default useGroups;
