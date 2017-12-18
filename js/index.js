class Cell {
    constructor(){
        this.isAlive = false;
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
        const data = field.data;
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const cols = data[rowIndex];
            const row = document.createElement("tr");
            for (let colIndex = 0; colIndex < cols.length; colIndex++) {
                const col = document.createElement("td");
                row.appendChild(col);
            }
            this.root.appendChild(row);
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
}

const app = new App(15, 10);
window.addEventListener("DOMContentLoaded", ()=>{
    const renderer = new Renderer(document.getElementById("root"));
    app.setRenderer(renderer);
    app.initialize();
});
