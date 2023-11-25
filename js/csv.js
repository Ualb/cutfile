const fs = require('fs');
const csv = require('csv-parser');

class CsvCut {
    static async cut(inputFilePath, outputFolderPath, cutSize, hasHeader, patterFileName) {
        // if the folder is error path
        if (outputFolderPath.includes('csv')) {
            outputFolderPath = outputFolderPath.split('/').filter(e => !e.includes('.csv') && e.length > 0).join('/');
        }
        try {
            if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath, {recursive: true});
            }

            let auxArrData = Array();
            let headers = '';
            let saveHeaders = true;
            let iterator = 0;
            let i = 1;

            // read file csv from path
            fs.createReadStream(inputFilePath)
                .pipe(csv({separator: ','}))
                .on('data', (row) => {
                    if (hasHeader && saveHeaders) {
                        headers = Object.keys(row).join(',');
                        saveHeaders = false;
                        return;
                    }
                    auxArrData.push(Object.values(row).map(elem => elem.toString()).join(','));
                    if (iterator < cutSize - 1) iterator++;
                    else {
                        iterator = 0;
                        const file = fs.createWriteStream(`${outputFolderPath}/${patterFileName}${i++}.csv`);
                        const toSave = hasHeader && headers.length > 0? [headers].concat(auxArrData): auxArrData;
                        toSave.forEach(value => {
                            file.write(value + '\n');
                        });
                        auxArrData = Array();
                    }
                })
                .on('end', () => {
                    // saving the remainder
                    const file = fs.createWriteStream(`${outputFolderPath}/${patterFileName}${i++}.csv`);
                    const toSave = hasHeader && headers.length > 0? [headers].concat(auxArrData): auxArrData;
                    toSave.forEach(value => {
                        file.write(value + '\n');
                    });
                });
            return {message:"Done!", status: true};
        } catch (e) {
            return {status: false, err: e.stackTrace + '\n' + e.message}
        }
    }
}

module.exports = {CsvCut};


