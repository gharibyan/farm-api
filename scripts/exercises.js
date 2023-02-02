const fs = require("fs")
const path = require("path")
const FILES_PATH = path.join(__dirname, "../files")

const transformArray = (arr) => arr.map((val) => {
    return isNaN(val) ? val : parseFloat(val)
}).filter(x => x)

const readFilesFolder = () => {
    return new Promise((resolve, reject) => {
        return fs.readdir(FILES_PATH, (error, files) => {
            if (error) return reject(error)
            return resolve(files)
        })
    })
}

const getCsvFiles = async () => {
    const files = await readFilesFolder()
    return files.filter(file => path.extname(file).toLowerCase() === ".csv")
}

const checkStringContainsDigit = (string) =>  /\d/.test(string)

async function run() {
    const transformableArray = ["John", "200.5", "Jake", "23", "Jane", "James", 100, 200, 300, "405", null, undefined]
    const csvFiles = await getCsvFiles()
    const hasDigitInString = checkStringContainsDigit("Hello12World")
    const dontHaveDigitInString = checkStringContainsDigit("Hello World")
    const onlyDigits = checkStringContainsDigit(1234)
    console.log("transform Array:", transformArray(transformableArray))
    console.log("CSV files:", csvFiles)
    console.log("hasDigitInString: true", hasDigitInString)
    console.log("hasDigitInString: false", dontHaveDigitInString)
    console.log("hasDigitInString: true: only digits", onlyDigits)
}

run()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
