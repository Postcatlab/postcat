import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';
import { testApiGroupTree } from 'eo/workbench/browser/src/app/shared/services/storage/db/tests/apiGroupTree';

setTimeout(async () => {
  await testApiGroupTree();
  const d = await db.project.collections('91ca042f-e12f-4416-9d93-ce5d2637e578');
  console.log('dddd', d);
});
