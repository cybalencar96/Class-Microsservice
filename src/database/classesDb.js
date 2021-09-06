import Id from "../Id/index.js"

export default function makeClassesDb({makeDb}) {
    return Object.freeze({
        findAll,
        findByClassId,
        findByTeacherId,
        findBySubject,
        findByTeacherAndSubject,
        insert,
        findAndDeleteClass,
        updateClass
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

            await Promise.all(searchInfo.map(async (_id) => {
                partialResult = await db.collection('classes').find({_id: _id});
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
        const db = await makeDb();
        const result = await db.collection('classes').find({teacherId: searchInfo}).toArray();
        if (result.length === 0) {
            return null
        }
        return result;
    }

    async function findBySubject(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({subject: {$regex: searchInfo, $options: "$i"}}).sort({subject:1}).toArray();
        if (result.length === 0) {
            return null
        }
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
        const classInserted = await db.collection('classes').find({_id:result.insertedId}).toArray();
        return classInserted[0];
    }

    async function findAndDeleteClass(classId) {
        const db = await makeDb();
        const { acknowledged, deletedCount } = await db.collection('classes').deleteOne({_id: classId});
        const allClasses = await db.collection('classes').find().sort({subject:1}).toArray();
        
        if (acknowledged && deletedCount > 0) {
            return {
                isDeleted: true,
                text: "Class is deleted.",
                body: allClasses
            }
        }

        if (acknowledged && deletedCount === 0) {
            return {
                isDeleted: false,
                text: "Class doesn't exists. It may has been deleted already.",
                body: allClasses
            }
        }
        if (!acknowledged) {
            return {
                isDeleted: false,
                text: "Unknown error has occured on gateway",
                body: allClasses
            }
        }
    }

    async function updateClass(editedClass) {
        const db = await makeDb();
        const updateDoc = {
            $set: {
                teacherId: editedClass.getTeacherId(),
                maxStudents: editedClass.getMaxStudents(),
                price: editedClass.getPrice(),
                _id: editedClass.getId(),
                subject: editedClass.getSubject(),
                students: editedClass.getStudents(),
                classDates: editedClass.getClassDates()
            }
        }
        const {
            acknowledged,
            modifiedCount,
            matchedCount
        } = await db.collection('classes').updateOne({_id: editedClass.getId()},updateDoc)
        
        const newEditedClass = await db.collection('classes').find({_id: editedClass.getId()}).toArray();
        
        if (modifiedCount === 1) {
            return {
                isModified: true,
                text: "Class update successful",
                body: newEditedClass
            }
        } else if (matchedCount === 1) {
            return {
                isModified: false,
                text: "Class found but not updated, no difference found",
                body: newEditedClass
            }
        } else {
            return {
                isModified: false,
                text: "Class not found",
                body: null
            }
        }
    }
}