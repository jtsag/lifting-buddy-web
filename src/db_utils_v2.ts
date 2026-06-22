import { db } from './firebase';
import { type Session, type Exercise, type Program } from './data_utils';
import {
    collection, doc, getDoc, getDocs,
    setDoc, updateDoc, deleteDoc, query, where
} from 'firebase/firestore';

// ═════════════════════════════════════════════════════════════════════════════
// USER ACCOUNT CONTROLS
// ═════════════════════════════════════════════════════════════════════════════

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

const uid = auth.currentUser!.uid;

// ═════════════════════════════════════════════════════════════════════════════
// SESSIONS
// ═════════════════════════════════════════════════════════════════════════════

export async function saveSession(session: Session): Promise<void> {
    await setDoc(doc(db, 'users', uid, 'sessions', String(session.time)), session);
}

export async function getSession(time: number): Promise<Session | undefined> {
    const snap = await getDoc(doc(db, 'users', uid, 'sessions', String(time)));
    return snap.exists() ? snap.data() as Session : undefined;
}

export async function getAllSessions(): Promise<Session[]> {
    const snap = await getDocs(collection(db, 'users', uid, 'sessions'));
    return snap.docs.map(d => d.data() as Session);
}

export async function getSessionsByExercise(exerciseName: string): Promise<Session[]> {
    const q = query(collection(db, 'users', uid, 'sessions'), where('parent', '==', exerciseName));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Session);
}

export async function updateSession(time: number, changes: Partial<Omit<Session, 'time'>>): Promise<void> {
    await updateDoc(doc(db, 'users', uid, 'sessions', String(time)), changes);
}

export async function deleteSession(time: number): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'sessions', String(time)));
}

export async function deleteSessionsByExercise(exerciseName: string): Promise<void> {
    const sessions = await getSessionsByExercise(exerciseName);
    await Promise.all(sessions.map(s => deleteDoc(doc(db, 'users', uid, 'sessions', String(s.time)))));
}

// ═════════════════════════════════════════════════════════════════════════════
// EXERCISES
// ═════════════════════════════════════════════════════════════════════════════

export async function saveExercise(exercise: Exercise): Promise<void> {
    await setDoc(doc(db, 'users', uid, 'exercises', exercise.name), exercise);
}

export async function getExercise(name: string): Promise<Exercise | undefined> {
    const snap = await getDoc(doc(db, 'users', uid, 'exercises', name));
    return snap.exists() ? snap.data() as Exercise : undefined;
}

export async function getAllExercises(): Promise<Exercise[]> {
    const snap = await getDocs(collection(db, 'users', uid, 'exercises'));
    return snap.docs.map(d => d.data() as Exercise);
}

export async function getExercisesByTag(tag: string): Promise<Exercise[]> {
    const q = query(collection(db, 'users', uid, 'exercises'), where('tags', 'array-contains', tag));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Exercise);
}

export async function addTagToExercise(name: string, tag: string): Promise<void> {
    const existing = await getExercise(name);
    if (!existing) throw new Error(`Exercise "${name}" not found`);
    if (!existing.tags.includes(tag)) {
        await updateDoc(doc(db, 'users', uid, 'exercises', name), { tags: [...existing.tags, tag] });
    }
}

export async function removeTagFromExercise(name: string, tag: string): Promise<void> {
    const existing = await getExercise(name);
    if (!existing) throw new Error(`Exercise "${name}" not found`);
    await updateDoc(doc(db, 'users', uid, 'exercises', name), { tags: existing.tags.filter(t => t !== tag) });
}

export async function deleteExercise(name: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'exercises', name));
}

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAMS
// ═════════════════════════════════════════════════════════════════════════════

export async function saveProgram(program: Program): Promise<void> {
    await setDoc(doc(db, 'users', uid, 'programs', program.exercise), program);
}

export async function getProgram(exercise: string): Promise<Program | undefined> {
    const snap = await getDoc(doc(db, 'users', uid, 'programs', exercise));
    return snap.exists() ? snap.data() as Program : undefined;
}

export async function getAllPrograms(): Promise<Program[]> {
    const snap = await getDocs(collection(db, 'users', uid, 'programs'));
    return snap.docs.map(d => d.data() as Program);
}

export async function updateProgramMax(exercise: string, newMax: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid, 'programs', exercise), { max: newMax });
}

export async function deleteProgram(exercise: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'programs', exercise));
}