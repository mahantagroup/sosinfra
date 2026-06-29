import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, secondaryAuth } from './Firebase';

export const generateAgentPassword = () =>
  String(Math.floor(10000000 + Math.random() * 90000000));

export const createAgentAccount = async ({
  email,
  password,
  formData,
  photographUrl,
  panCardUrl,
  aadhaarCardUrl,
  partnerRequestId,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate Unique Partner ID
  const agentsSnap = await getDocs(collection(db, 'agents'));
  const agentCount = agentsSnap.size;
  const agentIdSuffix = String(10000 + agentCount).padStart(6, '0');
  const agentId = `SOS-ACP-${agentIdSuffix}`;
  
  // Generate Unique 6-digit Referral Code
  const ownReferralCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Use secondaryAuth to create user without signing out the main admin
  const credential = await createUserWithEmailAndPassword(
    secondaryAuth,
    normalizedEmail,
    password
  );
  const { uid } = credential.user;

  // Sign out from secondary app immediately
  await signOut(secondaryAuth);

  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(' ');

  const agentData = {
    uid,
    agentId,
    ownReferralCode,
    loginId: normalizedEmail,
    email: normalizedEmail,
    role: 'agent',
    status: 'Pending',
    fullName,
    ...formData,
    photographUrl,
    panCardUrl,
    aadhaarCardUrl,
    partnerRequestId: partnerRequestId || null,
    passwordChanged: false,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'agents', uid), agentData);

  return { uid, agentId, ownReferralCode, loginId: normalizedEmail, password, agentData };
};

export const signInAgent = async (loginId, password) => {
  const normalizedEmail = loginId.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );

  const agentRef = doc(db, 'agents', credential.user.uid);
  const agentSnap = await getDoc(agentRef);

  if (!agentSnap.exists()) {
    await signOut(auth);
    throw new Error('Agent account not found. Please contact support.');
  }

  return { user: credential.user, agent: { id: agentSnap.id, ...agentSnap.data() } };
};

export const getAgentProfile = async (uid) => {
  const agentRef = doc(db, 'agents', uid);
  const agentSnap = await getDoc(agentRef);
  if (!agentSnap.exists()) return null;
  return { id: agentSnap.id, ...agentSnap.data() };
};

export const signOutAgent = () => signOut(auth);

export const setAgentPasswordOnce = async (uid, loginId, currentPassword, newPassword) => {
  const agentRef = doc(db, 'agents', uid);
  const agentSnap = await getDoc(agentRef);

  if (!agentSnap.exists()) {
    throw new Error('Agent account not found.');
  }
  if (agentSnap.data().passwordChanged) {
    throw new Error('Password has already been set. You cannot change it again.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to set your password.');
  }

  const normalizedEmail = loginId.trim().toLowerCase();
  const credential = EmailAuthProvider.credential(normalizedEmail, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  await updateDoc(agentRef, {
    passwordChanged: true,
    passwordChangedAt: serverTimestamp(),
  });
};
