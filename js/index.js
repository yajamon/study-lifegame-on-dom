class Cell {
    constructor(){
        this.isAlive = false;
    }
    toggleState(){
        this.isAlive = !this.isAlive;
    }
}
class Field {
    /**
     *
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.data = [];
    }
    reset(){
        let verticals = [];
        for (let y = 0; y < this.height; y++) {
            let horizontals = [];
            for (let x = 0; x < this.width; x++) {
                horizontals.push(new Cell());
            }
            verticals.push(horizontals);
        }
        this.data = verticals;
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    cellByIndex(x, y){
        return this.data[y][x];
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    toggleState(x, y){
        const cell = this.cellByIndex(x, y);
        cell.toggleState();
    }

    update(){
        this.data[0][0].toggleState();
    }
}
class Renderer {
    /**
     * @param {HTMLElement} root
     */
    constructor (root) {
        this.root = root;
    }
    /**
     * @param {Field} field
     */
    setup(field) {
        this.field = field;
        const data = this.field.data;
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const cols = data[rowIndex];
            const row = document.createElement("tr");
            for (let colIndex = 0; colIndex < cols.length; colIndex++) {
                const col = document.createElement("td");
                col.dataset["x"] = colIndex;
                col.dataset["y"] = rowIndex;
                row.appendChild(col);
            }
            this.root.appendChild(row);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    renderCell(x, y){
        const cell = this.field.cellByIndex(x, y);
        const dom = this.root
            .children.item(y)
            .children.item(x);
        this.applyCellStatus(cell, dom);
    }
    /**
     *
     * @param {Cell} cell
     * @param {HTMLElement} dom
     */
    applyCellStatus(cell, dom){
        if (cell.isAlive) {
            dom.classList.add("alive");
            dom.classList.remove("dead");
        } else {
            dom.classList.remove("alive");
            dom.classList.add("dead");
        }
    }

    render(){
        const data = this.field.data;
        const trs = this.root.children;
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const cols = data[rowIndex];
            const tds = trs.item(rowIndex).children;
            for (let colIndex = 0; colIndex < cols.length; colIndex++) {
                const cell = cols[colIndex];
                const td = tds.item(colIndex);
                this.applyCellStatus(cell, td);
            }
        }
    }
}

class App {
    /**
     *
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.field = new Field(width, height);
    }
    /**
     *
     * @param {Renderer} renderer
     */
    setRenderer(renderer){
        this.renderer = renderer;
    }
    initialize(){
        this.field.reset();
        this.renderer.setup(this.field);
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    toggleState(x, y){
        // console.log(x, y);
        this.field.toggleState(x, y);
        this.renderer.renderCell(x, y);
    }

    start (){
        if(this.timerId){ return; }

        this.field.update();
        this.iteration();
    }
    iteration(){
        const fps = 2;
        const nextTime = Date.now() + 1000 / fps;

        this.renderer.render();
        this.field.update();

        const schedule = nextTime - Date.now();
        const waitTime = schedule > 0? schedule: 0;
        this.timerId = setTimeout(() => {
            this.iteration();
        }, waitTime);
    }
    stop (){
        if(!this.timerId){ return; }
        clearTimeout(this.timerId);
        this.timerId = null;
        this.renderer.render();
    }
}

const app = new App(15, 10);
window.addEventListener("DOMContentLoaded", ()=>{
    const root = document.getElementById("root");
    const renderer = new Renderer(root);
    app.setRenderer(renderer);
    app.initialize();

    root.addEventListener("click", (event)=>{
        Array.from(root.querySelectorAll("td"))
            .filter(dom => dom === event.target)
            .forEach(element => {
                let data = element.dataset;
                app.toggleState(data["x"], data["y"]);
            });
    });

    document.getElementById("start").addEventListener("click", ()=>{
        app.start();
    });
    document.getElementById("stop").addEventListener("click", ()=>{
        app.stop();
    });
});
