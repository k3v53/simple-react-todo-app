import Dexie from 'dexie';

const dexie_database = new Dexie('todoDB');
dexie_database.version(1).stores({
    todo: `id,name,checked`
});

const db = {
    db: dexie_database,

}
export default db;