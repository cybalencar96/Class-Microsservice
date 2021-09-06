export default function makeCallback(controller) {
    return (req,res) => {
        const httpRequest = {
            body: req.body,
            query: req.query,
            params: req.params,
            ip: req.ip,
            method: req.method,
            path: req.path,
        }

        controller(httpRequest)
        .then(httpResponse => {
            res.type('json')
            res.status(httpResponse.statusCode).send(httpResponse)
        })
        .catch(e => {
            console.log(e)
            res.status(500).send({error: 'An unknown error has occurred', message: e})
        })
    }
}