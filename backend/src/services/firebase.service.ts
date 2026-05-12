import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any;

try {
  const firebaseConfigPath = path.join(__dirname, '../../firebase-applet-config.json');
  const firebaseConfig = JSON.parse(readFileSync(firebaseConfigPath, 'utf8'));
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase');
}

export class FirebaseService {
  static async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error(`Error getting document: ${error}`);
      throw new AppError('Failed to fetch document', 500);
    }
  }

  static async getDocuments(collectionName: string, constraints: any[] = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting documents: ${error}`);
      throw new AppError('Failed to fetch documents', 500);
    }
  }

  static async createDocument(collectionName: string, data: Record<string, any>) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating document: ${error}`);
      throw new AppError('Failed to create document', 500);
    }
  }

  static async updateDocument(collectionName: string, docId: string, data: Record<string, any>) {
    try {
      const docRef = doc(db, collectionName, docId);
      
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp()
      });
      
      return { id: docId, ...data };
    } catch (error) {
      console.error(`Error updating document: ${error}`);
      throw new AppError('Failed to update document', 500);
    }
  }

  static async deleteDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document: ${error}`);
      throw new AppError('Failed to delete document', 500);
    }
  }

  static async queryDocuments(collectionName: string, field: string, operator: any, value: any) {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying documents: ${error}`);
      throw new AppError('Failed to query documents', 500);
    }
  }
}

export default FirebaseService;
