import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../firebaseConfig.js'
export function initializeDatabase() {
  const app = initializeApp(firebaseConfig)
  return getFirestore(app)
}
