class data_usage {

    constructor() {}


    async test(value) {


        let testValue = (value.then((result) => { 
            let splits = (JSON.stringify(result));

            return splits;

        }))
        console.log("PRINT: " + JSON.stringify(value))
    }




}
module.exports = data_usage;