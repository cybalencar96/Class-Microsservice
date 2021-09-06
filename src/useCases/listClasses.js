export default function makeListClasses ({ classesDb }) {
    return async function listClasses(type = null, searchParam = null) {
        if (type === null) {
            const result = await classesDb.findAll();
            return result;
        }
        if (type === 'byClassId') {
            const result = await classesDb.findByClassId(searchParam);
            return result;
        }
        if (type === 'byTeacherId') {
            const result = await classesDb.findByTeacherId(searchParam);
            return result;
        }
        if (type === 'byClassName') {
            const result = await classesDb.findByClassSubject(searchParam);
            return result;
        }
    }
}