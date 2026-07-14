import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, updateDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { auth, db, secondaryAuth } from './Firebase';

export const generateAgentPassword = () =>
  String(Math.floor(10000000 + Math.random() * 90000000));

/**
 * ONE-TIME UTILITY: Call this once from an admin page/console to sync
 * the Firestore counter with the highest existing agentId in the database.
 * Safe to call multiple times — it is idempotent.
 */
export const syncAgentIdCounter = async () => {
  let maxNumber = 10000;
  const agentsSnap = await getDocs(collection(db, 'agents'));
  agentsSnap.forEach((d) => {
    const id = d.data().agentId || '';
    const match = id.match(/SOS-ACP-(\d{6})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  const counterRef = doc(db, 'counters', 'agentIdCounter');
  await setDoc(counterRef, { count: maxNumber }, { merge: true });
  console.log(`✅ Counter synced. Last issued ID: SOS-ACP-${String(maxNumber).padStart(6,'0')}. Next will be: SOS-ACP-${String(maxNumber + 1).padStart(6,'0')}`);
  return maxNumber;
};

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
  
  // Generate Unique Partner ID securely using transaction
  let nextAgentNumber;
  const counterRef = doc(db, 'counters', 'agentIdCounter');

  // Self-healing: find the highest agentId number currently in Firestore
  // so the counter can never go backwards even if it was previously out of sync
  let maxExistingNumber = 10000;
  try {
    const agentsSnap = await getDocs(collection(db, 'agents'));
    agentsSnap.forEach((d) => {
      const id = d.data().agentId || '';
      const match = id.match(/SOS-ACP-(\d{6})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxExistingNumber) maxExistingNumber = num;
      }
    });
  } catch (e) {
    console.warn('Could not scan existing agentIds for self-healing:', e);
  }

  try {
    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const counterValue = counterDoc.exists() ? counterDoc.data().count : 10000;
      // Always pick the higher of the stored counter or the max existing ID
      nextAgentNumber = Math.max(counterValue, maxExistingNumber) + 1;
      if (counterDoc.exists()) {
        transaction.update(counterRef, { count: nextAgentNumber });
      } else {
        transaction.set(counterRef, { count: nextAgentNumber });
      }
    });
  } catch (error) {
    console.error("Error generating unique Agent ID: ", error);
    throw new Error("Failed to assign a unique Agent ID. Please try again.");
  }
  
  const agentIdSuffix = String(nextAgentNumber).padStart(6, '0');
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
