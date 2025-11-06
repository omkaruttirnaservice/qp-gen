let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getRamdomNumber = (digits) => {
    if (!digits) return false;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

export const validateTestKey = async (testKey) => {
    let _req = {
        url: SERVER_IP + '/api/test/check-for-duplicate-test-key',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testKey }),
    };

    try {
        let _res = await fetch(_req.url, {
            method: _req.method,
            headers: _req.headers,
            body: _req.body,
        });
        let _data = await _res.json();
        return _data._success !== 2;
    } catch (error) {
        if (error.message == 'Failed to fetch') {
            alert('Error in fetch validating test key', error.message);
        } else {
            alert(error.message);
        }
        return false;
    }
};

export const generateTestKey = async (id) => {
    let _key = `${id}`;

    console.log(typeof _key, '==_key==');

    if (+id <= 9) {
        _key += getRamdomNumber(3);
    } else if (+id <= 99) {
        _key += getRamdomNumber(2);
    } else if (+id <= 999) {
        _key += getRamdomNumber(1);
    }

    let isValid = await validateTestKey(_key);

    console.log(isValid, 'isValid');

    if (isValid) {
        return _key;
    } else {
        return false;
    }
};

let lastMainName = '';
let lastSub = '';
export const renderTopicHeader = (mainTopicName, subTopicSection) => {
    let header = null;
    if (subTopicSection !== lastSub) {
        lastSub = subTopicSection;
        header = (
            `<div className="bg-gradient-to-r from-green-200 to-green-400 text-gray-800 font-semibold py-2 px-4 rounded-t-md shadow-sm">
                {mainTopicName} :: {subTopicSection}
            </div>`
        );
    }
    if (mainTopicName !== lastMainName) {
        lastMainName = mainTopicName;
    }
    return header;
};
