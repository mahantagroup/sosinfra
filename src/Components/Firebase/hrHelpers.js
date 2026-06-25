import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './Firebase';

export const fetchAllAgents = async () => {
  try {
    const q = query(collection(db, 'agents'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(collection(db, 'agents'));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
};

export const fetchPartnerRequests = async () => {
  const q = query(collection(db, 'partnerRequests'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateAgentStatus = async (agentUid, status, partnerRequestId = null) => {
  const updates = {
    status,
    updatedAt: serverTimestamp(),
    ...(status === 'Approved' ? { approvedAt: serverTimestamp() } : { approvedAt: null }),
  };

  await updateDoc(doc(db, 'agents', agentUid), updates);

  if (partnerRequestId) {
    await updateDoc(doc(db, 'partnerRequests', partnerRequestId), {
      status,
      updatedAt: serverTimestamp(),
    });
  }
};

export const approveAgent = (agentUid, partnerRequestId) =>
  updateAgentStatus(agentUid, 'Approved', partnerRequestId);

export const unapproveAgent = (agentUid, partnerRequestId) =>
  updateAgentStatus(agentUid, 'Pending', partnerRequestId);

export const deleteAgent = async (agentUid, partnerRequestId = null) => {
  try {
    await deleteDoc(doc(db, 'agents', agentUid));
    if (partnerRequestId) {
      await deleteDoc(doc(db, 'partnerRequests', partnerRequestId));
    }
  } catch (err) {
    console.error("Error in deleteAgent helper:", err);
    throw err;
  }
};

export const formatAgentName = (agent) =>
  agent.fullName ||
  [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' ') ||
  '—';

export const formatDate = (timestamp) => {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
