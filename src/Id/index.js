//package to generate random string ids
import cuid from 'cuid'

const Id = Object.freeze({
    makeId: cuid,
    isValidId: cuid.isCuid
});

export default Id;