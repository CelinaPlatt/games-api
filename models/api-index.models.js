const {readFile} = require('fs/promises')

exports.readEndpointsJson =  async(req,res,next) => {
    const fileContents = await readFile('./endpoints.json','utf8');
    return JSON.parse(fileContents);
}