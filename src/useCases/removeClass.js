export default function makeRemoveClass ({classesDb}) {
    return async function removeClass (classId,userId) {
        const classs = await classesDb.findByClassId(classId)
        
        if (!classs) {
            throw new Error ('class not found')
        }

        if (classs.teacherId !== userId) {
            throw new Error ("Only the teacher of the class can delete it")
        }
        const {isDeleted, text, body} = await classesDb.deleteClass(classId,userId);
        
        return {
            isDeleted,
            text,
            body
        }
    }
}
