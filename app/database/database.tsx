import { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

let db: SQLiteDatabase;

// เปิด database ด้วยวิธีใหม่ของ expo-sqlite v15
async function openDB() {
  db = await SQLite.openDatabaseAsync('myDatabase.db');
  return db;
}

// Create table
export async function createTable() {
  if (!db) await openDB();
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activity (
      activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_name TEXT,
      activity_detail TEXT,
      activity_type INTEGER,
      importance INTEGER,
      urgent INTEGER,
      datetime TEXT,
      notification_sound INTEGER,
      shaking INTEGER,
      show_more INTEGER
    );
  `);
  
  console.log('✅ Table created');
}

// Insert example
export async function insertExampleActivity(data) {
    console.log('insertExampleActivity => ', data)
    if (!db) await openDB();
    
    await db.runAsync(`
        INSERT INTO activity 
          (activity_name, activity_detail, activity_type, importance, urgent, datetime, notification_sound, shaking, show_more)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [data.activity_name, data.activity_detail, data.activity_type, data.importance, data.urgent, data.datetime, data.notification_sound, data.shaking, data.show_more]);
    
    console.log('✅ Inserted activity');
  }

// Fetch data
export async function fetchActivities() {
  if (!db) await openDB();
  
  const result = await db.getAllAsync<{
    activity_id: number;
    activity_name: string;
    activity_detail: string;
    activity_type: number;
    importance: number;
    urgent: number;
    datetime: string;
    notification_sound: number;
    shaking: number;
    show_more: number;
  }>('SELECT * FROM activity');
  console.log('result',result)
  return result;
}

export async function deleteActivity(activityId: number) {
    if (!db) await openDB();
  
    await db.runAsync(
      'DELETE FROM activity WHERE activity_id = ?',
      [activityId]
    );
    
    console.log(`🗑️ Deleted activity with ID: ${activityId}`);
  }

// Initialize database
export async function initDatabase() {
  await openDB();
  await createTable();
  console.log('✅ Database initialized');
}