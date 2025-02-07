// Worksheet Editor JS

// UI
const LabelOrientation = Object.freeze({
    Top    : 'Top',
    Bottom : 'Bottom',
    None   : 'None'
});

const PieceSet = Object.freeze({
    wikipedia : 'wikipedia',
    alpha     : 'alpha',
    chess24   : 'chess24',
    dilena    : 'dilena',
    leipzig   : 'leipzig',
    metro     : 'metro',
    symbol    : 'symbol',
    uscf      : 'uscf',
});

class WorksheetEditorParams
{
    constructor()
    {
        this.exWidth          = 3.5;                  // inches
        this.answerSpace      = 1;                    // inches
        this.labOrientation   = LabelOrientation.Top; // where the exercise labels go

        this.whiteSquareColor = "#f0e0c7";
        this.blackSquareColor = "#d4baa5";

        this.pieceSet         = PieceSet.Wikipedia;
    }
}

let params = new WorksheetEditorParams();

function clearElem(elem)
{
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function resetParams()
{
    params = new WorksheetEditorParams();
    buildEditor();
    buildBoards();
}

function buildOrientationSelect()
{
    const option  = optName => {
        let elem       = document.createElement('option');
        elem.innerHTML = optName;
        elem.value     = optName;
        return elem;
    }

    const oriElem = document.querySelector('#labOrientation');
    clearElem(oriElem);

    for (let value of Object.keys(LabelOrientation))
        oriElem.appendChild(option(value));

    // for some reason this starts as '', which caused the hide button to have to be clicked twice.
    document.querySelector('#editor').style.display = 'grid';
}

function buildPieceSelect()
{
    const option  = optName => {
        let elem       = document.createElement('option');
        elem.innerHTML = optName;
        elem.value     = optName;
        return elem;
    }

    const setElem = document.querySelector('#pieceSet');
    clearElem(setElem);

    for (let value of Object.keys(PieceSet))
        setElem.appendChild(option(value));
}

function populateDefaults()
{
    for (let param of Object.keys(params))
    {
        const elem = document.querySelector(`#${param}`);
        if (!elem)
        {
            console.error(`Did not find aneditor element for ${param}`);
            continue;
        }
        elem.value = params[param];
    }        
}

function buildEditor()
{
    populateDefaults();
    buildOrientationSelect();
    buildPieceSelect();

    // for some reason this starts as '', which caused the hide button to have to be clicked twice.
    document.querySelector('#editor').style.display = 'grid';
}

function hideEditor()
{
    document.querySelector('#editor').style.display = 'none';
    document.querySelector('#hideButton').innerHTML = 'Show';
}

function showEditor()
{
    document.querySelector('#editor').style.display = 'grid';
    document.querySelector('#hideButton').innerHTML = 'Hide';
}

function toggleEditor()
{
    console.log(document.querySelector('#editor').style.display)
    document.querySelector('#editor').style.display == 'grid' ? hideEditor() : showEditor();
}

function readEditorParams()
{
    for (let param of Object.keys(params))
    {
        const elem = document.querySelector(`#${param}`);
        if (!elem)
        {
            console.error(`Did not find aneditor element for ${param}`);
            continue;
        }
        params[param] = elem.value;
    }  

    console.log(params);
}

// Boards

function buildBoard(n) {
    let elem         = document.createElement('div');
    elem.id          = `board${n}`;
    elem.style.width = `${params.exWidth}in`

    return elem;
}

function updateColors()
{
    for (let square of document.querySelectorAll('.white-1e1d7'))
        square.style.background = params.whiteSquareColor;
    for (let square of document.querySelectorAll('.black-3c85d'))
        square.style.background = params.blackSquareColor;
}

function buildBoards()
{
    readEditorParams();

    const boardContainer = document.querySelector('#boards');
    clearElem(boardContainer);

    let n = 0
    for (let fen of fens)
    {
        let container = document.createElement('div');
        container.className = "p-5 m-5 mt-0 pt-0 mb-0 pb-0 break-inside-avoid"
        container.style.marginBottom = `${params.answerSpace}in`;
    
        let toMove      = fen.split(' ')[1];
        let sideToMove  = toMove == 'w' ? "White to move" : "Black to move";

        let exlab = document.createElement('p');
        exlab.contentEditable = true;
        exlab.innerHTML       = `${n+1}. `
        exlab.innerHTML       += sideToMove;
        exlab.className       = "text-center font-bold width-full";
        exlab.style.width     = `${params.exWidth}in`; 
    
        let board = buildBoard(n);
    
        if (params.labOrientation == LabelOrientation.Top)
        {
            container.appendChild(exlab);
            container.appendChild(board);
        } else if (params.labOrientation == LabelOrientation.Bottom)
        {
            container.appendChild(board);
            exlab.style.marginTop = '30px';
            container.appendChild(exlab);
        } else {
            container.appendChild(board);
        }
    
        boardContainer.appendChild(container);
        
        let orientation = toMove == 'w' ? 'white' : 'black';
        Chessboard(`board${n}`, {
            position: fen.split(' ')[0],
            orientation: orientation,
            pieceTheme: `/img/chesspieces/${params.pieceSet}/{piece}.png`,
        })
        n++;
        
    }

    updateColors();
}
