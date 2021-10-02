import makeClass from "../class/index.js";
export default function makeAddClass ({classesDb}) {
    return async function addClass (classInfo) {
        const classs = makeClass(classInfo);
        const exists = await classesDb.findByTeacherAndSubject({teacherId: classs.getTeacherId(), subject: classs.getSubject()});
        if (exists) {
            return {
                text: "class already exists",
                class:exists
            }
        }

        return classesDb.insert({...classs})
    }
}