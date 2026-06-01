import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface MyDB extends DBSchema {
    sessions: {
        key: number;
        value: {
            time: number;
            parent: string;
            sets: number;
            reps: number;
            weight: number;
        };
    };
    exercises: {
        key: string;
        value: {
            name: string;
            tags: string[];
        };
    };
    programs: {
        key: string;
        value: {
            exercise: string;
            max: number;
        }
    };

}

export const db = await openDB<MyDB>('lifting-buddy-db', 1, {
    upgrade(db) {
        db.createObjectStore('sessions', { keyPath: 'time' });
        db.createObjectStore('exercises', { keyPath: 'name' });
        db.createObjectStore('programs', { keyPath : 'exercise'});
    }
});