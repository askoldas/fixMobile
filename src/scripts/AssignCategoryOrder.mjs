// src/scripts/AssignCategoryOrder.js

import { getDocs, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.mjs';

async function assignOrderToCategories() {
  const snapshot = await getDocs(collection(db, 'Devices'));
  const allCategories = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  // Group by parent
  const grouped = {};
  for (const cat of allCategories) {
    const parent = cat.parent || 'root';
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(cat);
  }

  let totalUpdates = 0;

  for (const [parentId, group] of Object.entries(grouped)) {
    group.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < group.length; i++) {
      const cat = group[i];
      const ref = doc(db, 'Devices', cat.id);

      await setDoc(ref, { order: i }, { merge: true });
      console.log(`✅ Updated ${cat.name} (${cat.type}) → order: ${i}`);
      totalUpdates++;
    }
  }

  console.log(`\n✅ Total categories updated: ${totalUpdates}`);
}

assignOrderToCategories().catch((err) => {
  console.error('❌ Error assigning order:', err);
});