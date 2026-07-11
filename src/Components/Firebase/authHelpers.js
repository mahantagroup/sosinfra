import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./Firebase";

export const signInAdmin = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  
  // Verify if this user exists in the admins collection
  const adminDocRef = doc(db, "admins", cred.user.uid);
  const adminDocSnap = await getDoc(adminDocRef);
  
  if (!adminDocSnap.exists()) {
    await signOutAdmin();
    throw new Error("Unauthorized access. Admin privileges required.");
  }
  
  return cred.user;
};

export const signUpAdmin = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // Store user in admins collection
  const adminDocRef = doc(db, "admins", cred.user.uid);
  await setDoc(adminDocRef, {
    email: cred.user.email,
    role: "admin",
    createdAt: serverTimestamp()
  });
  
  return cred.user;
};

export const listenAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const signOutAdmin = () => signOut(auth);
