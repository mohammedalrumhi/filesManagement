// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  deleteDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  where,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVaK4z3JegQ0l5QEi4h9iuqecCeoh3_Ao",
  authDomain: "twjeeh-dev-84df5.firebaseapp.com",
  projectId: "twjeeh-dev-84df5",
  storageBucket: "twjeeh-dev-84df5.appspot.com",
  messagingSenderId: "827206962887",
  appId: "1:827206962887:web:a29918caa123e5af7a38e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// Function to create user and store in Firestore
export const createUser = async (email, password, additionalData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the newly created user's ID
    const userId = userCredential.user.uid;

    await setDoc(doc(firestore, "users", userId), {
      email: email,
      ...additionalData,
    });

    console.log("User created and added to Firestore successfully!");
    // return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const createGroup = async (data) => {
  try {
    // Create user with email and password

    // Get the newly created user's ID
    const groupRef = doc(collection(firestore, "groups"));

    await setDoc(groupRef, data);

    //console.log("group created successfully!");
    // return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateGroup = async (groupId, newData) => {
  try {
    const groupRef = doc(collection(firestore, "groups"), groupId);

    await updateDoc(groupRef, newData);

    console.log("Group updated successfully!");
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
};

export const deleteDocumentById = async (collectionName, id) => {
  try {
    const documentRef = doc(firestore, collectionName, id);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      await deleteDoc(documentRef);
      console.log(`Document with ID ${id} deleted successfully`);
    } else {
      console.error(`Document with ID ${id} doesn't exist`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getCollections = async (name) => {
  try {
    const collectionsRef = collection(firestore, name); // Replace 'your_root_collection' with your actual root collection
    const collectionsSnapshot = await getDocs(collectionsRef);

    return collectionsSnapshot;
  } catch (error) {
    return null;
  }
};

export const getDataByGroupId = async (groupId) => {
  try {
    const q = query(
      collection(firestore, "files"),
      where("groupUid", "==", groupId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

export const checkUserRole = async (collectionName, userId) => {
  console.log("user id is from checkUserRole  : " + userId);
  try {
    const userDocRef = doc(firestore, collectionName, userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      console.log("this is user data: " + userData.role);

      if (userData.role === "admin") {
        console.log(" i am  reruning admin");
        return true;
      } else {
        console.log("I am not admin ");
        return false;
      }
    } else {
      console.log("I am not admin  exist() from checkUserRole");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const getUserById = async (collectionName, userId) => {
  try {
    const userDocRef = doc(firestore, collectionName, userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    } else {
      console.error("User document doesn't exist");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
export const getCollectionById = async (collectionName, id) => {
  try {
    const userDocRef = doc(firestore, collectionName, id);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    } else {
      console.error("User document doesn't exist");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

//this
export const getCollectionsWithCondition = async (name, valueToCheck) => {
  console.log("user id is : " + valueToCheck);
  try {
    const collectionsRef = collection(firestore, name);
    const collectionsSnapshot = await getDocs(collectionsRef);

    const matchingDocuments = [];
    const isRoleAdmin = await checkUserRole("users", valueToCheck);
    collectionsSnapshot.forEach((doc) => {
      const data = doc.data();

      if (isRoleAdmin) {
        console.log("i am inside the role of admin");
        matchingDocuments.push({ id: doc.id, ...data });
      } else {
        console.log("i am user and will be go for next");
        if (data.ids && Array.isArray(data.ids)) {
          console.log("I have one of the ids : ");
          const found = data.ids.some((item) => item.value === valueToCheck);
          if (found) {
            console.log("found from ");
            matchingDocuments.push({ id: doc.id, ...data });
          }
        } else {
          console.log("no ids avaliable");
        }
      }
    });

    return matchingDocuments;
  } catch (error) {
    return null;
  }
};

// Function to create a user with email and password
// const createUserWithEmailAndPassword = async (email, password) => {
//   try {
//     const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
//     const user = userCredential.user;
//     console.log('User created:', user.uid);
//     // You can store other user-related data in Firestore if needed
//     await db.collection('users').doc(user.uid).set({
//       email: user.email,
//       // other user details...
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//   }
// };

export const handleFileUpload = async (
  files,
  groupUid,
  progressCallback,
  displayName
) => {
  console.log("called function file upload");
  if (!files) {
    throw new Error("No files to upload");
  }

  const storageRef = ref(storage, groupUid);
  const totalFiles = files.length;
  let filesUploaded = 0;

  for (const file of files) {
    const randomFileName = `${uuidv4()}_${file.name}`;
    console.log(randomFileName);
    const fileRef = ref(storageRef, randomFileName);
    const uploadTask = uploadBytesResumable(fileRef, file);

    try {
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressCallback(progress);
          },
          (error) => {
            console.error("Error uploading file:", error);
            reject(error);
          },
          async () => {
            filesUploaded++;
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const filesRef = doc(collection(firestore, "files"));
            await setDoc(filesRef, {
              title: displayName,
              name: randomFileName,
              path: downloadURL,
              timestamp: serverTimestamp(),
              groupUid: groupUid,
            });

            if (filesUploaded === totalFiles) {
              console.log("now done uploading!!!");
              resolve();
            }
          }
        );
      });
    } catch (error) {
      // Handle errors here
      console.error("Error uploading file:", error);
      throw error;
    }
  }
};

export const deleteFile = async (fileId, groupUid) => {
  try {
    // Delete document from Firestore
    const filesRef = doc(collection(firestore, "files"), fileId);
    await deleteDoc(filesRef);

    // Delete file from Firebase Storage
    const fileRef = ref(storage, `${groupUid}`);


    
      const listResult = await listAll(fileRef);
      const items = listResult.items;
  
      // Delete each item (file) in the folder
      await Promise.all(items.map(async (item) => {
        await deleteObject(item);
        console.log(`Deleted file: ${item.name}`);
      }));

   // await deleteObject(fileRef);

    console.log("File and document deleted successfully.");
  } catch (error) {
    console.error("Error deleting file and document:", error);
    throw error;
  }
};

export default app;
