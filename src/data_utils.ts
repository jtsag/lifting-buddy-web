// ─── Session Types ────────────────────────────────────────────────────────────

import { deleteExercise, getAllExercises, getSessionsByExercise } from "./db_utils_v2";

export type Session = {
    time: number;
    parent: string;
    sets: number;
    reps: number;
    weight: number;
};

// ─── Exercise Types ───────────────────────────────────────────────────────────

export type Exercise = {
    name: string;
    tags: string[];
};

// ─── Program Types ────────────────────────────────────────────────────────────

export type Program = {
    exercise: string;
    max: number;
};

// ─── Utility Funcs ────────────────────────────────────────────────────────────

export function sessionDisplayParts(session:Session) : string[] {
    const date = (new Date(session.time)).toLocaleDateString("en-US", {
        weekday:"short",
        month:"short",
        day:'2-digit'
    })
    return [date, `${session.sets} x ${session.reps}`, `${session.weight} lbs`]
}

export function exerciseTagString(exercise:Exercise) {
    return exercise.tags.join(" | ")
}

export function generateProgList(prog:Program) {
    const weeks : number[][] = Array(16).fill([0,0,0])
    const max = prog.max
    weeks[0] = [4, 10, roundToFive(0.65 * max)]
    weeks[2] = [4, 8, roundToFive(0.7 * max)]
    weeks[4] = [3, 8, roundToFive(0.75 * max)]
    weeks[6] = [4, 5, roundToFive(0.8 * max)]
    weeks[8] = [3, 5, roundToFive(0.85 * max)]
    weeks[10] = [4, 3, roundToFive(0.9 * max)]
    weeks[12] = [3, 3, roundToFive(0.95 * max)]
    weeks[14] = [3, 2, max]

    for(var i = 1; i < 16; i+=2) {
        weeks[i] = weeks[i-1]
    }

    return weeks
}

function roundToFive(num : number) {
    return Math.round(num / 5.0) * 5
}

export function findSuggestion(prog : (Program | undefined), sessionList : Session[]) : (string[] | undefined) {
    if(!prog) return undefined
    const arr = generateProgList(prog)
    var lastMatch = -1

    for(const entry of sessionList) {
        for(var idx = lastMatch+1; idx < arr.length; idx++) {
            if(entry.sets === arr[idx][0]
                && entry.reps === arr[idx][1]
                && entry.weight === arr[idx][2]
            ) {
                lastMatch=idx
                break
            }
        }
    }

    if(lastMatch == arr.length - 1) {
        return ["", "1 x 1", "max lbs"]
    }

    const hl = (lastMatch % 2 === 0)? "L" : "H"
    const setRep = "" + arr[lastMatch + 1][0] + " x " + arr[lastMatch + 1][1]
    const weight = "" + arr[lastMatch + 1][2] + " lbs"

    return [hl, setRep, weight]
}

export async function dataCleanup() {
    // Step 1: Clear out any exercises with no remaining history
    const exerList = await getAllExercises();
    for(const exer of exerList) {
        const sessionList = await getSessionsByExercise(exer.name);
        if(sessionList.length === 0) {
            deleteExercise(exer.name)
        }
    }
}