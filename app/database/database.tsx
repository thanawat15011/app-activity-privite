import { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

let db: SQLiteDatabase;

async function openDB() {
  db = await SQLite.openDatabaseAsync('myDatabase.db');
  return db;
}


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
      show_more INTEGER,
      active INTEGER
    );
  `);
  
  console.log('✅ Table created');
}

export async function insertExampleActivity(data :any) {
    console.log('insertExampleActivity => ', data)
    if (!db) await openDB();
    
    await db.runAsync(`
        INSERT INTO activity 
          (activity_name, activity_detail, activity_type, importance, urgent, datetime, notification_sound, shaking, show_more, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [data.activity_name, data.activity_detail, data.activity_type, data.importance, data.urgent, data.datetime, data.notification_sound, data.shaking, data.show_more, 1]);
    
  }

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
    active: number;
  }>('SELECT * FROM activity');
  return result;
}

export async function fetchActivitiesByID(activityId: number) {
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
      active: number;
    }>(
      'SELECT * FROM activity WHERE activity_id = ?',
      [activityId]
    );
  
    return result;
  }
  
  export async function fetchActivitiesByDateMonth(date: any) {
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
      active: number;
    }>(
      `SELECT * FROM activity 
       WHERE date(datetime) = ?
       ORDER BY urgent DESC, importance DESC, datetime ASC`,
      [date]
    );
    
    return result;
  }
  

export async function deleteActivity(activityId: number) {
    if (!db) await openDB();
  
    await db.runAsync(
      'DELETE FROM activity WHERE activity_id = ?',
      [activityId]
    );
    
  }

  export async function updateActivity(data :any) {
    if (!db) await openDB();
  
    await db.runAsync(
      `
      UPDATE activity SET 
        activity_name = ?,
        activity_detail = ?,
        activity_type = ?,
        importance = ?,
        urgent = ?,
        datetime = ?,
        notification_sound = ?,
        shaking = ?,
        show_more = ?
      WHERE activity_id = ?
      `,
      [
        data.activity_name,
        data.activity_detail,
        data.activity_type,
        data.importance,
        data.urgent,
        data.datetime,
        data.notification_sound,
        data.shaking,
        data.show_more,
        data.activity_id, 
      ]
    );
  }


  export async function fetchActivitiesByDateTime() {
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
      active: number;
    }>(
      `SELECT * FROM activity WHERE datetime >= DATE('now') AND active = 1`,
    );

    return result;
  }
  

  export async function updateActivityActive(data: any) {
    console.log('data :>> ', data);
    if (!db) await openDB();
    
    try {
      await db.runAsync(
        `UPDATE activity 
         SET active = ? 
         WHERE activity_id = ?`,
        [data.active, data.activity_id]
      );
      
      console.log(`อัปเดตสถานะ active เป็น ${data.active} สำหรับ activity_id: ${data.activity_id} สำเร็จ`);
      return true;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดต activity:', error);
      return false;
    }
  }
  
export async function initDatabase() {
  await openDB();
  await createTable();
}