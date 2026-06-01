import { db } from './db';
import { type Session, type Exercise, type Program } from './data_utils';

// ═════════════════════════════════════════════════════════════════════════════
// SESSIONS
// ═════════════════════════════════════════════════════════════════════════════

// Add or overwrite a session (key is session.time)
export async function saveSession(session: Session): Promise<void> {
    await db.put('sessions', session);
}

// Get a single session by its timestamp key
export async function getSession(time: number): Promise<Session | undefined> {
    return db.get('sessions', time);
}

// Get all sessions
export async function getAllSessions(): Promise<Session[]> {
    return db.getAll('sessions');
}

// Get all sessions for a specific exercise (parent)
export async function getSessionsByExercise(exerciseName: string): Promise<Session[]> {
    const all = await db.getAll('sessions');
    return all.filter(s => s.parent === exerciseName);
}

// Update specific fields on a session
export async function updateSession(time: number, changes: Partial<Omit<Session, 'time'>>): Promise<void> {
    const existing = await db.get('sessions', time);
    if (!existing) throw new Error(`Session ${time} not found`);
    await db.put('sessions', { ...existing, ...changes });
}

// Delete a session by timestamp
export async function deleteSession(time: number): Promise<void> {
    await db.delete('sessions', time);
}

// Delete all sessions for a specific exercise
export async function deleteSessionsByExercise(exerciseName: string): Promise<void> {
    const sessions = await getSessionsByExercise(exerciseName);
    await Promise.all(sessions.map(s => db.delete('sessions', s.time)));
}

// ═════════════════════════════════════════════════════════════════════════════
// EXERCISES
// ═════════════════════════════════════════════════════════════════════════════

// Add or overwrite an exercise (key is exercise.name)
export async function saveExercise(exercise: Exercise): Promise<void> {
    await db.put('exercises', exercise);
}

// Get a single exercise by name
export async function getExercise(name: string): Promise<Exercise | undefined> {
    return db.get('exercises', name);
}

// Get all exercises
export async function getAllExercises(): Promise<Exercise[]> {
    return db.getAll('exercises');
}

// Get all exercises that have a specific tag
export async function getExercisesByTag(tag: string): Promise<Exercise[]> {
    const all = await db.getAll('exercises');
    return all.filter(e => e.tags.includes(tag));
}

// Add a tag to an exercise
export async function addTagToExercise(name: string, tag: string): Promise<void> {
    const existing = await db.get('exercises', name);
    if (!existing) throw new Error(`Exercise "${name}" not found`);
    if (!existing.tags.includes(tag)) {
        await db.put('exercises', { ...existing, tags: [...existing.tags, tag] });
    }
}

// Remove a tag from an exercise
export async function removeTagFromExercise(name: string, tag: string): Promise<void> {
    const existing = await db.get('exercises', name);
    if (!existing) throw new Error(`Exercise "${name}" not found`);
    await db.put('exercises', { ...existing, tags: existing.tags.filter(t => t !== tag) });
}

// Delete an exercise by name
export async function deleteExercise(name: string): Promise<void> {
    await db.delete('exercises', name);
}

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAMS
// ═════════════════════════════════════════════════════════════════════════════

// Add or overwrite a program (key is program.exercise)
export async function saveProgram(program: Program): Promise<void> {
    await db.put('programs', program);
}

// Get a single program by exercise name
export async function getProgram(exercise: string): Promise<Program | undefined> {
    return db.get('programs', exercise);
}

// Get all programs
export async function getAllPrograms(): Promise<Program[]> {
    return db.getAll('programs');
}

// Update the max for a program
export async function updateProgramMax(exercise: string, newMax: number): Promise<void> {
    const existing = await db.get('programs', exercise);
    if (!existing) throw new Error(`Program for "${exercise}" not found`);
    await db.put('programs', { ...existing, max: newMax });
}

// Delete a program by exercise name
export async function deleteProgram(exercise: string): Promise<void> {
    await db.delete('programs', exercise);
}