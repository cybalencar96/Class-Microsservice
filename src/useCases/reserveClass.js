export default function makeReserveClass ({classesDb}) {
    return async function reserveClass(userId,classId) {
        
        const {isBooked, text, body} = await classesDb.classReservation('book',userId,classId);
        return {isBooked, text, body};
    }
}