import Id from "../Id/index.js"

export default function makeClassesDb({makeDb}) {
    return Object.freeze({
        findAll,
        findByClassId,
        findByTeacherId,
        findBySubject,
        findByTeacherAndSubject,
        insert
    });

    async function findAll() {
        const db = await makeDb();
        const result = await db.collection('classes').find().sort({class: 1}).toArray();
        if (result.length === 0) {
            return null;
        }
        return result;
    }

    async function findByClassId(searchInfo) {
        const db = await makeDb()
        if (Array.isArray(searchInfo)) {
            let partialResult = {};
            let result = [];

            await Promise.all(searchInfo.map(async (id) => {
                partialResult = await db.collection('classes').find({_id: id});
                const found = await partialResult.toArray();
                result.push(found[0]);                
            }));

            if (result.length === 0){
                return null
            }
            return result;
        }

        const result = await db.collection('classes').find({ _id: searchInfo })
        const found = await result.toArray();
        if (found.length === 0) {
            return null
        }
        return found[0]
    }

    async function findByTeacherId(searchInfo) {
        const db = makeDb();
        const result = await db.collection('classes').find({teacherId: searchInfo}).toArray();
        if (result.length === 0) {
            return null
        }
        return result;
    }

    async function findBySubject(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({subject: {$regex: searchInfo, $options: "$i"}}).sort({subject:1}).toArray();
        return result;
    }

    async function findByTeacherAndSubject(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({teacherId: searchInfo.teacherId, subject: searchInfo.subject}).toArray();
        if (result.length === 0) {
            return null
        }
        return result[0];
    }

    async function insert({...classs }) {
        const db = await makeDb();
        console.log(classs)
        const newClass = {
            _id: classs.getId(),
            teacherId: classs.getTeacherId(),
            createdAt: classs.getCreatedAt(),
            maxStudents: classs.getMaxStudents(),
            price: classs.getPrice(),
            subject: classs.getSubject(),
            classDates: classs.getClassDates(),
            students: classs.getStudents()
        }
        const result = await db.collection('classes').insertOne(newClass)
        return result;
    }
}