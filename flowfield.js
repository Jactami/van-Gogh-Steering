class Flowfield {

    constructor(w, h, res, rate, seed) {
        this.res = res;
        this.cols = ceil(w / this.res);
        this.rows = ceil(h / this.res);
        this.rate;
        this.grid;
        this.generateField(rate, seed);
    }

    generateField(rate, seed) {
        if (seed != undefined) {
            noiseSeed(seed);
        } // else use predefined seed

        this.rate = rate;
        this.grid = new Array(this.cols);
        let yoff = 0;
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = new Array(this.rows);
            let xoff = 0;
            for (let j = 0; j < this.rows; j++) {
                let n = noise(xoff, yoff);
                let angle = n * PI * 4;
                this.grid[i][j] = p5.Vector.fromAngle(angle);
                xoff += this.rate;
            }
            yoff += this.rate;
        }

        this.grid;
    }

    getVectorAtPos(x, y) {
        let col = floor(x / this.res);
        let row = floor(y / this.res);

        return this.grid[col][row].copy();
    }

    // visualisation for debugging
    show() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let v = this.grid[i][j].setMag(this.res * 0.5);
                let cx = (i + 0.5) * this.res;
                let cy = (j + 0.5) * this.res;
                stroke(0);
                line(cx - v.x, cy - v.y, cx + v.x, cy + v.y);
            }
        }
    }
}