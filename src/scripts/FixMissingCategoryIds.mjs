import { getDocs, collection, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase.mjs';
import slugify from 'slugify';

async function fixMissingCategoryIds() {
  const snapshot = await getDocs(collection(db, 'Devices'));
  let fixCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const currentDocId = docSnap.id;

    if (!data.id) {
      const newId = slugify(data.name || 'untitled', { lower: true });

      await setDoc(doc(db, 'Devices', newId), {
        ...data,
        id: newId,
      });

      await deleteDoc(doc(db, 'Devices', currentDocId));

      console.log(`✅ Fixed: ${data.name} → ${newId}`);
      fixCount++;
    }
  }

  console.log(`\n✅ Total fixed documents: ${fixCount}`);
}

fixMissingCategoryIds().catch((err) => {
  console.error('❌ Error during fix:', err);
});
