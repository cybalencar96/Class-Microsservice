export default function makeReserveClass ({classesDb}) {
    return async function reserveClass(userId,classId) {
        const classs = await classesDb.findByClassId(classId)

        if (!classs) {
            throw new Error ('Class not found')
        }

        if (classs.teacherId === userId) {
            throw new Error ('You are the teacher of the class')
        }

        if (classs.students.length === classs.maxStudents) {
            throw new Error ('Class is full')
        }

        let bookedStudent = classs.students.find(student => student === userId );
        if (!!bookedStudent) {
            throw new Error ('Student is already in this class')
        }

        const {isBooked, text, bookedClass} = await classesDb.classReservation('book',userId,classId);
        return {isBooked, text, bookedClass};
    }
}