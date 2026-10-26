#!/usr/bin/env python3
"""Replay a /api/stats/backup JSON dump into NOVA_COUNTER_DB.
Monotonic by construction: visitors merge (keep earliest first_seen, latest
last_seen, max visits), events dedup on (ts, kind, cid); the run aborts if the
resulting total would be lower than the DB's current total."""
import json, os, sqlite3, sys

def main(dump_path):
    db = os.environ.get("NOVA_COUNTER_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "nova_counters.db"))
    dump = json.load(open(dump_path, encoding="utf-8"))
    con = sqlite3.connect(db)
    con.execute("CREATE TABLE IF NOT EXISTS visitors(cid TEXT PRIMARY KEY, first_seen REAL, last_seen REAL, visits INTEGER DEFAULT 1)")
    con.execute("CREATE TABLE IF NOT EXISTS events(ts REAL, kind TEXT, cid TEXT, day TEXT, hour TEXT)")
    before = con.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
    for v in dump.get("visitors", []):
        con.execute(
            "INSERT INTO visitors(cid, first_seen, last_seen, visits) VALUES(?,?,?,?) "
            "ON CONFLICT(cid) DO UPDATE SET first_seen=MIN(first_seen, excluded.first_seen), "
            "last_seen=MAX(last_seen, excluded.last_seen), visits=MAX(visits, excluded.visits)",
            (v["cid"], v["first_seen"], v["last_seen"], v["visits"]))
    for e in dump.get("events", []):
        con.execute(
            "INSERT INTO events(ts, kind, cid, day, hour) SELECT ?,?,?,?,? "
            "WHERE NOT EXISTS (SELECT 1 FROM events WHERE ts=? AND kind=? AND cid=?)",
            (e["ts"], e["kind"], e["cid"], e["day"], e["hour"], e["ts"], e["kind"], e["cid"]))
    after = con.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
    if after < before:
        con.rollback()
        print(f"ABORT: total would decrease {before} -> {after}")
        return 1
    con.commit()
    print(f"OK: total {before} -> {after} (visitors), events now {con.execute('SELECT COUNT(*) FROM events').fetchone()[0]}")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
