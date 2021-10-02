import makeClass from "../class/index.js";
export default function makeEditClass ({classesDb}) {
    return async function editClass(classInfo) {
        const editedClass = makeClass({
            _id: classInfo._id,
            teacherId: classInfo.teacherId,
            maxStudents: classInfo.maxStudents,
            price: classInfo.price,
            subject: classInfo.subject,
            students: classInfo.students,
            classDates: classInfo.classDates
        })
        const {isModified, text, body} = await classesDb.updateClass(editedClass);
        return {
            isModified,
            text,
            body,
        };
    }
}