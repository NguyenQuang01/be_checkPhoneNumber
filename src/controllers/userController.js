const axios = require("axios");
const XLSX = require("xlsx");
const https = require("https");
const XlsxPopulate = require("xlsx-populate");
const { error } = require("console");
function removeLeadingZero(phoneNumber) {
    if (phoneNumber.startsWith("0")) {
        return phoneNumber.substring(1);
    }
    return phoneNumber;
}
function sanitizePhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== "string") return ""; // Return empty string if phoneNumber is null, undefined, or not a string

    // Remove non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, "");
    // Replace '84' with '0' if it appears at the beginning
    phoneNumber = phoneNumber.replace(/^84/, "0");
    return phoneNumber;
}

const findDuplicatePhoneNumbers = (dataExcel, dataCRM) => {
    const sanitizedPhoneList = dataCRM.map((entry) => {
        return {
            phone_mobile: sanitizePhoneNumber(entry.phone_mobile),
        };
    });
    const duplicates = [];
    const duplicateCount = {};

    dataExcel.forEach((subArr1) => {
        subArr1.forEach((phoneNumber) => {
            if (
                phoneNumber &&
                sanitizedPhoneList.some(
                    (obj) =>
                        obj.phone_mobile &&
                        obj.phone_mobile.includes(phoneNumber)
                )
            ) {
                duplicates.push(phoneNumber);
                duplicateCount[removeLeadingZero(phoneNumber)] =
                    (duplicateCount[phoneNumber] || 0) + 1;
            }
        });
    });
    const duplicateCountArray = Object.entries(duplicateCount).map(
        ([phone, count], index) => ({
            id: index + 1,
            phone: `0${phone}`,
            count,
        })
    );
    return { duplicates, duplicateCount: duplicateCountArray };
};
module.exports = {
    checkPhone: async (req, res) => {
        const token = req.query.code;
        async function fetchData() {
            try {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false, // (NOTE: this will disable client verification)
                    passphrase: "YYY",
                });
                const response = await axios.get(
                    "https://manage.jaxtina.com/rest/v11_3/v1/user/list",

                    {
                        httpsAgent,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return response.data.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        const dataCRM = await fetchData();

        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ success: false, message: "No file uploaded." });
            }

            const workbook = XLSX.read(req.file.buffer);

            // Khai báo một mảng để lưu trữ tất cả các dữ liệu từ tất cả các trang
            let allData = [];

            // Lặp qua tất cả các trang trong workbook
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const options = {
                    header: 1,
                    raw: false,
                };
                let data = XLSX.utils
                    .sheet_to_json(worksheet, options)
                    .slice(1);
                allData = allData.concat(data);
            });

            const dataPhoneNumber = allData.map((row) => {
                return [
                    row[4], // Cột E
                    row[6], // Cột G
                    row[8], // Cột I
                    row[10], // Cột K
                    row[12], // Cột M
                    row[20], // Cột U
                ];
            });

            const { duplicates, duplicateCount } = findDuplicatePhoneNumbers(
                dataPhoneNumber,
                dataCRM
            );

            // Generate Excel with duplicates highlighted
            const outputWorkbook = await XlsxPopulate.fromDataAsync(
                req.file.buffer
            );

            // Lặp qua tất cả các trang trong workbook và tô màu các ô chứa số điện thoại trùng lặp
            workbook.SheetNames.forEach((sheetName) => {
                const outputWorksheet = outputWorkbook.sheet(sheetName);
                outputWorksheet.usedRange().forEach((cell) => {
                    if (
                        cell.value() &&
                        duplicates.includes(`${cell.value()}`)
                    ) {
                        cell.style("fill", "ff0000"); // Set background color to red for duplicates
                    }
                });
            });

            const excelBuffer = await outputWorkbook.outputAsync();
            res.json({
                success: 200,
                message: "File uploaded and processed successfully.",
                data: {
                    duplicateCount,
                },
                excelBuffer: excelBuffer.toString("base64"),
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred during processing.",
            });
        }
    },
    checkOnlyPhone: async (req, res) => {
        const { phone, token } = req.body;
        async function fetchData() {
            try {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false, // (NOTE: this will disable client verification)
                    passphrase: "YYY",
                });
                const response = await axios.get(
                    "https://manage.jaxtina.com/rest/v11_3/v1/user/list",

                    {
                        httpsAgent,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return response.data.data;
            } catch (error) {
                console.error("testss", error);
            }
        }
        const dataCRM = await fetchData();
        const sanitizedPhoneList = dataCRM.map((entry) => {
            return {
                phone_mobile: sanitizePhoneNumber(entry.phone_mobile),
            };
        });
        if (sanitizedPhoneList === undefined) {
            res.status(400).json({ message: "Unauthorized" });
        } else {
            const result = sanitizedPhoneList.filter(
                (item) =>
                    item?.phone_mobile &&
                    item?.phone_mobile.includes(removeLeadingZero(phone))
            );
            if (result) {
                res.json({
                    status: 200,
                    data: [
                        {
                            phone: result[0]?.phone_mobile,
                            id: 1,
                        },
                    ],
                });
            } else {
                res.json({
                    status: 201,
                    data: [
                        {
                            phone: "không có số trong hệ thống",
                            id: 1,
                        },
                    ],
                });
            }
        }
    },
};
