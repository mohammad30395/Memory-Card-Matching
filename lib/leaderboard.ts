import { STORAGE_KEYS } from "./constants";
import { readStorage, removeStorage, writeStorage } from "./localStorage";
import type { LeaderboardRecord } from "./types";

export function getLeaderboardRecords(): LeaderboardRecord[] {
  return readStorage<LeaderboardRecord[]>(STORAGE_KEYS.leaderboard, []).sort(
    (firstRecord, secondRecord) =>
      new Date(secondRecord.createdAt).getTime() - new Date(firstRecord.createdAt).getTime(),
  );
}

export function appendLeaderboardRecord(record: LeaderboardRecord) {
  const records = getLeaderboardRecords();
  writeStorage(STORAGE_KEYS.leaderboard, [record, ...records]);
}

export function clearLeaderboardRecords() {
  removeStorage(STORAGE_KEYS.leaderboard);
}
