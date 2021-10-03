export default function makeRemoveReserveClass ({classesDb}) {
    return async function removeReserveClass (userId,classId) {
        const classs = await classesDb.findByClassId(classId)

        if (!classs) {
            throw new Error ('Class not found')
        }

        let bookedStudent = classs.students.find(student => student === userId );
        if (!bookedStudent) {
            throw new Error ('Student is not in this class')
        }

        const {isUnbooked, text, unbookedClass} = await classesDb.classReservation('unbook',userId,classId);
        return {isUnbooked, text, unbookedClass};
    }
}