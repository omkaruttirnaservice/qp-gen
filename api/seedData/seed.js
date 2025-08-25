function getRandomOption() {
    let option = ['a', 'b', 'c', 'd'];
    return option[Math.floor(Math.random() * 4)];
}

function insertDummyStudents() {
    let studentId = 90000;

    const q = `INSERT INTO tm_student_question_paper
        (sqp_question_id, 
        sqp_student_id, 
        sqp_test_id, 
        sqp_publish_id, 
        sqp_is_remark, 
        sqp_index_value, 
        sqp_time, 
        sqp_ans, 
        added_time, 
        sqp_min, 
        sqp_sec)
    VALUES ?
    `;

    let insertData = [];
    for (let i = 0; i < 10000; i++) {
        ++studentId;
        insertData.push(`(1, ${studentId}, 3, 1, 0, 0, 0, ${getRandomOption()}, 0, 0, 0)`);
    }
    console.log(insertData);
}

function generateStudentQuestionPaper() {
    
}

insertDummyStudents();
