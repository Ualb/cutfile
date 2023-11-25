const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path')

class Xlsx {

    static async createNewBook(data, sheetName, fileOutput) {
        const newWorkbook = new ExcelJS.Workbook();
        const newWorksheet = newWorkbook.addWorksheet(sheetName);
        newWorksheet.addRows(data);
        await newWorkbook.xlsx.writeFile(fileOutput);
    }

    static async cut(inputFilePath, outputFolderPath, cutSize, hasHeader, patterFileName) {
        try {
            // if the folder is error path
            if (outputFolderPath.includes('xlsx')) {
                outputFolderPath = outputFolderPath.split('/').filter(e => !e.includes('.xlsx') && e.length > 0).join('/');
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(inputFilePath);
            const worksheets = workbook.worksheets;
            if (worksheets.length > 0) {
                let columnNames = [];
                let dataToSave = Array();
                let isFirstRow = true;
                let counterCutSize = 0;
                let fileCounter = 0;

                worksheets[0].eachRow(async (row, rowNumber) => {
                    if (hasHeader && isFirstRow) {
                        columnNames = row.values.filter((element) => element !== undefined && element !== null && element !== '');
                        isFirstRow = false;
                    } else if (counterCutSize + 1 !== cutSize) {
                        if (counterCutSize === 0) {
                            dataToSave = [];
                        }
                        dataToSave.push(row.values);
                        ++counterCutSize;
                    } else {
                        dataToSave.push(row.values);
                        if (hasHeader) {
                            dataToSave.unshift(columnNames);
                        }
                        ++fileCounter;
                        counterCutSize = 0;
                        await this.createNewBook(
                            dataToSave,
                            worksheets[0].name,
                            `${outputFolderPath}/${patterFileName}${fileCounter}.xlsx`
                        );
                    }
                });

                if (dataToSave.length !== 0) {
                    if (hasHeader) {
                        dataToSave.unshift(columnNames);
                    }
                    await this.createNewBook(
                        dataToSave,
                        worksheets[0].name,
                        `${outputFolderPath}/${patterFileName}${++fileCounter}.xlsx`
                    );
                }
            }

            return {message:"Done!", status: true};
        } catch (e) {
            console.log(e)
            return {status: false, err: e.stackTrace + '\n' + e.message}
        }
    }
}


module.exports = {Xlsx};
