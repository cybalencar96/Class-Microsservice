export default function makeRemoveClass ({classesDb}) {
    return async function removeClass (classId) {
        const {isDeleted, text, body} = await classesDb.findAndDeleteClass(classId);
        
        return {
            isDeleted,
            text,
            body
        }
    }
}
