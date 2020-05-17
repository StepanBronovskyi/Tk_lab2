const fs = require('fs');

class Lexer {
    constructor() {
        this.inputFilePath = './input.txt';
        this.outputFilePath = './output.txt';
        this.currentLineNumber = 0;
        this.headPosition = 0;
        this.allLines = [];

    }
    readInput() {
        this.allLines = fs.readFileSync(this.inputFilePath).toString().split('\n');
        console.log('input: ');
        console.log(this.allLines);
    }

    cleanOutput() {
        fs.writeFileSync(this.outputFilePath, '');
    }

    appendToFile(data) {
        fs.appendFileSync(this.outputFilePath, data);
    }

    writeLexem(lexemType, lexem, error = '') {
        let displayName;
        if (!error) {
            displayName = lexemType + ' \\ ' + lexem;
        }
        else {
            displayName = `Error: ${error} in sentence ${this.currentLineNumber} in  position ${this.headPosition}\n`;
            this.appendToFile('\n');
            this.headPosition = 0;
            this.currentLineNumber++;
        }
        displayName += '\r\n';
        console.log(displayName);
        this.appendToFile(displayName);
    }

    writeError() {
        displayName = `Error: ${error} in sentence ${this.currentLineNumber} in  position ${this.headPosition}\n`;
        this.currentLineNumber++;
        this.headPosition = 0;
    }

    getCurrentElement() {
        if (this.currentLineNumber >= this.allLines.length) {
            return '';
        }
        const line = this.allLines[this.currentLineNumber];
        if (this.headPosition > line.length - 1) {
            this.headPosition = 0;
            this.currentLineNumber++;
            return this.getCurrentElement();
        }
        else {
            const currentSymbol = line[this.headPosition];
            this.headPosition++;

            return currentSymbol;
        }
    }

    moveHeadToPrevPosition() {
        this.headPosition--;
    }

    getToken() {
        let currentElement = this.getCurrentElement();
        while (currentElement === ' ') {
            currentElement = this.getCurrentElement();
        }
        if (currentElement === ':') {
            this.processAssignment();
        }

        // else if (currentElement === 'i') {
        //     this.processIf();
        // }
        //
        // else if (currentElement === 't') {
        //     this.processThen();
        // }

        else if (currentElement === '(') {
            this.processOpenedBrace();
        }

        else if (currentElement === ')') {
            this.processClosedBrace();
        }

        // else if (currentElement === '*') {
        //     this.processStar();
        // }
        //
        // else if (currentElement === '+') {
        //     this.processPlus();
        // }

        else if (currentElement === 'a') {
            this.processIdenA();
        }

        else if (currentElement === 'b') {
            this.processIdenB();
        }

        else if (currentElement === '1') {
            this.processIden123();
        }

        else if (currentElement === '2') {
            this.processIdenNumber();
        }

        else if (currentElement === ',') {
            this.processComma();
        }

        else if (currentElement === '') {
            console.log('End of program');
        }

        else {
            this.writeLexem('', '', `Unexepected identifier ${currentElement}`);
            this.getToken();
        }
    }

    processAssignment() {
        const currentElement = this.getCurrentElement();
        const assignmentToken = ':' + currentElement;
        if (assignmentToken !== LexemEnum.assignmentOperator) {
            this.writeLexem('', '', 'Unepected itentifier: "expected := operator"');
            this.getToken();
        }
        else {
            this.writeLexem('assignmentOperator', LexemEnum.assignmentOperator);
            this.getToken();
        }
    }

    processOpenedBrace() {
        this.writeLexem('openedBrace', LexemEnum.openedBrace);
        this.getToken();
    }

    processClosedBrace() {
        this.writeLexem('closedBrace', LexemEnum.closedBrace);
        this.getToken();
    }


    processIdenA() {
        let lexem = 'a';
        let currentElement = this.getCurrentElement();
        lexem += currentElement;
        const idenLexenNames = ['idenA1', 'idenA2'];
        const idenLexenValues = idenLexenNames.map(name => LexemEnum[name]);
        if (idenLexenValues.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValues.indexOf(lexem)];
            this.writeLexem(lexenName, lexem);
            this.getToken();
        }
        else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processIdenB() {
        let lexem = 'b';
        let currentElement = this.getCurrentElement();
        lexem += currentElement;
        const idenLexenNames = ['idenB1', 'idenB2'];
        const idenLexenValues = idenLexenNames.map(name => LexemEnum[name]);
        if (idenLexenValues.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValues.indexOf(lexem)];
            this.writeLexem(lexenName, lexem);
            this.getToken();
        }
        else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processIden123() {
        let lexem = '1';
        let currentElement = this.getCurrentElement();
        let currentElement2 = this.getCurrentElement();
        const idenLexenNames = ['iden123'];
        const idenLexenValue = '123';
        if (idenLexenValue.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValue.indexOf(lexem)];
            if (lexem + currentElement + currentElement2 === LexemEnum.iden123) {
                this.writeLexem('iden123', LexemEnum.iden123);
                return this.getToken();
            }
        } else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processIdenNumber() {
        let lexem = '2';
        let currentElement = this.getCurrentElement();
        lexem += currentElement;
        const idenLexenNames = ['iden22', 'iden222'];
        const idenLexenValues = idenLexenNames.map(name => LexemEnum[name]);
        if (idenLexenValues.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValues.indexOf(lexem)];
            currentElement = this.getCurrentElement();
            if (lexem + currentElement === LexemEnum.iden222) {
                this.writeLexem('iden222', LexemEnum.iden222);
                return this.getToken();
            }
            else {
                this.moveHeadToPrevPosition();
            }
            this.writeLexem(lexenName, lexem);
            this.getToken();
        }
        else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processIden() {
        let lexem = 'x';
        let currentElement = this.getCurrentElement();
        lexem += currentElement;
        const idenLexenNames = ['idenX1', 'idenX2', 'idenX23'];
        const idenLexenValues = idenLexenNames.map(name => LexemEnum[name]);
        if (idenLexenValues.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValues.indexOf(lexem)];
            if (lexenName === 'idenX2') {
                currentElement = this.getCurrentElement();
                if (lexem + currentElement === LexemEnum.idenX23) {
                    this.writeLexem('idenx23', LexemEnum.idenX23);
                    return this.getToken();
                }
                else {
                    this.moveHeadToPrevPosition();
                }
            }
            this.writeLexem(lexenName, lexem);
            this.getToken();
        }
        else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processComma() {
        this.writeLexem('comma', LexemEnum.comma);
        this.getToken();
    }
}

const LexemEnum = {
    //assignmentOperator: ':=',
    //ifOperator: 'if',
    //thenOperator: 'then',
    openedBrace: '(',
    closedBrace: ')',
    // star: '*',
    // plus: '+',
    pointcomma: ';',
    idenA1: 'a1',
    idenA2: 'a2',
    idenB1: 'b1',
    idenB2: 'b2',
    iden123: '123',
    iden22: '22',
    iden222: '222',
    comma: ','
};

module.exports = {
    Lexer,
    LexemEnum
};