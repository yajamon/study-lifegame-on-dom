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
        let rows = [];
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            let cols = [];
            for (let colIndex = 0; colIndex < this.width; colIndex++) {
                cols.push(new Cell());
            }
            rows.push(cols);
        }
        this.data = rows;
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
        if (cell.isAlive) {
            dom.classList.add("alive");
            dom.classList.remove("dead");
        } else {
            dom.classList.remove("alive");
            dom.classList.add("dead");
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
});
