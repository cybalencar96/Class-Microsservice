export default function makeRemoveReserveClass ({classesDb}) {
    return async function removeReserveClass (userId,classId) {
        
        const {isUnbooked, text, body} = await classesDb.classReservation('unbook',userId,classId);
        return {isUnbooked, text, body};
    }
}