export default function makeRemoveClass ({classesDb}) {
    return async function removeClass (classId,userId) {
        const {isDeleted, text, body} = await classesDb.findAndDeleteClass(classId,userId);
        
        return {
            isDeleted,
            text,
            body
        }
    }
}
