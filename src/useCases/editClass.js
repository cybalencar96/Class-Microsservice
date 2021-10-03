import makeClass from "../class/index.js";
export default function makeEditClass ({classesDb}) {
    return async function editClass(classInfo) {

        const classs = await classesDb.findByClassId(classInfo._id)

        if(!classs) {
            throw new Error ('Class not found')
        }

        if (classs.teacherId !== classInfo.teacherId) {
            throw new Error ("Only the teacher can edit it")
        }

        const toUpdateClass = makeClass({
            _id: classInfo._id,
            teacherId: classInfo.teacherId,
            maxStudents: classInfo.maxStudents,
            price: classInfo.price,
            subject: classInfo.subject,
            students: classInfo.students,
            classDates: classInfo.classDates
        })
        const {isModified, text, editedClass} = await classesDb.updateClass(toUpdateClass);
        return {
            isModified,
            text,
            editedClass,
        };
    }
}