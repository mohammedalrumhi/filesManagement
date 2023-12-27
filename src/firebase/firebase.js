// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  where,
  query,
  serverTimestamp,
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

    console.log("group created successfully!");
    // return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
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

export const handleFileUpload = (files, groupUid, progressCallback) => {
  const storageRef = ref(storage, groupUid);
  const totalFiles = files.length;
  let filesUploaded = 0;

  return new Promise((resolve, reject) => {
    files.forEach(async (file) => {
      const fileRef = ref(storageRef, file.name);
      const uploadTask = uploadBytesResumable(fileRef, file);

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
            name: file.name,
            path: downloadURL,
            timestamp: serverTimestamp(),
            groupUid: groupUid,
          });

          if (filesUploaded === totalFiles) {
            resolve();
          }
        }
      );
    });
  });
};

export default app;
