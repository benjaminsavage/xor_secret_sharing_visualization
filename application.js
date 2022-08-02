window.onload = function() {
    const secret = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,0,0,0,1,1,1,1,1],
        [1,1,1,0,0,1,1,1,0,0,1,1,1],
        [1,1,0,1,1,1,1,1,1,1,0,1,1],
        [1,1,0,1,1,0,1,0,1,1,0,1,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,1,0,1,1,0,0,0,1,1,0,1,1],
        [1,1,0,1,1,1,1,1,1,1,0,1,1],
        [1,1,1,0,0,1,1,1,0,0,1,1,1],
        [1,1,1,1,1,0,0,0,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];
    var random_mask = generateRandomMask();
    var masked_secred = generateMaskedSecret(secret, random_mask);

    const secret_image_ctx = document.getElementById('original_image').getContext('2d');
    secret_image_ctx.scale(10, 10);
    const random_mask_image_ctx = document.getElementById('random_mask').getContext('2d');
    random_mask_image_ctx.scale(10, 10);
    const masked_secret_image_ctx = document.getElementById('masked_secret').getContext('2d');
    masked_secret_image_ctx.scale(10, 10);

    drawImage(secret, secret_image_ctx);
    drawImage(random_mask, random_mask_image_ctx);
    drawImage(masked_secred, masked_secret_image_ctx);

    const playgound_canvas = document.getElementById('playground');
    const playground_ctx = playgound_canvas.getContext('2d');
    var x1 = 100;
    var y1 = 100;
    var x2 = 0;
    var y2 = 0;
    drawPlayground(random_mask, masked_secred, x1, y1, x2, y2, playgound_canvas, playground_ctx);

    playgound_canvas.addEventListener("mousemove", (event) => {
        x2 = event.offsetX - 65;
        y2 = event.offsetY - 65;
        drawPlayground(random_mask, masked_secred, x1, y1, x2, y2, playgound_canvas, playground_ctx);
    });

    window.addEventListener('keydown', (event) => {
        if (event.key == 'b') {
            random_mask = secret;
            masked_secred = generateSolidColorMask(0);
        } else if (event.key == 'w') {
            random_mask = secret;
            masked_secred = generateSolidColorMask(1);
        } else if (event.key == 'c') {
            random_mask = secret;
            masked_secred = generateCheckerboardMask();
        } else {
            random_mask = generateRandomMask();
            masked_secred = generateMaskedSecret(secret, random_mask);
        }
        drawImage(random_mask, random_mask_image_ctx);
        drawImage(masked_secred, masked_secret_image_ctx);
        drawPlayground(random_mask, masked_secred, x1, y1, x2, y2, playgound_canvas, playground_ctx);
    });
}

function getFillStyle(val) {
    return val == 1 ? 'white' : 'black';
}

function drawPlayground(a, b, a_x, a_y, b_x, b_y, canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ret = [];
    var w1 = (b_x + 10000 - a_x)%10;
    if (w1 == 0) {
        w1 = 10;
    }
    var h1 = (b_y + 10000 - a_y)%10;
    if (h1 == 0) {
        h1 = 10;
    }
    var w2 = (a_x + 10000 - b_x)%10;
    if (w2 == 0) {
        w2 = 10;
    }
    var h2 = (a_y + 10000 - b_y)%10;
    if (h2 == 0) {
        h2 = 10;
    }

    ctx.strokeRect(a_x, a_y, 130, 130);
    ctx.strokeRect(b_x, b_y, 130, 130);

    for(var i = 0; i < 13; i++) {
        for(var j = 0; j < 13; j++) {
            const x1 = a_x + 10*i;
            const y1 = a_y + 10*j;
            const x2 = b_x + 10*i;
            const y2 = b_y + 10*j;

            const top_left = {
                x: Math.floor((x1 - b_x)/10.0),
                y: Math.floor((y1 - b_y)/10.0),
            };
            const top_right = {
                x: top_left.x + 1,
                y: top_left.y,
            };
            const bottom_left = {
                x: top_left.x,
                y: top_left.y + 1,
            };
            const bottom_right = {
                x: top_left.x + 1,
                y: top_left.y + 1,
            };

            if (inBounds(top_left)) {
                ctx.fillStyle = getFillStyle(a[j][i] ^ b[top_left.y][top_left.x]);
            } else {
                ctx.fillStyle = getFillStyle(a[j][i]);
            }
            ctx.fillRect(x1, y1, w1, h1);

            if (inBounds(top_right)) {
                ctx.fillStyle = getFillStyle(a[j][i] ^ b[top_right.y][top_right.x]);
            } else {
                ctx.fillStyle = getFillStyle(a[j][i]);
            }
            ctx.fillRect(x1 + w1, y1, 10 - w1, h1);

            if (inBounds(bottom_left)) {
                ctx.fillStyle = getFillStyle(a[j][i] ^ b[bottom_left.y][bottom_left.x]);
            } else {
                ctx.fillStyle = getFillStyle(a[j][i]);
            }
            ctx.fillRect(x1, y1 + h1, w1, 10 - h1);

            if (inBounds(bottom_right)) {
                ctx.fillStyle = getFillStyle(a[j][i] ^ b[bottom_right.y][bottom_right.x]);
            } else {
                ctx.fillStyle = getFillStyle(a[j][i]);
            }
            ctx.fillRect(x1 + w1, y1 + h1, 10 - w1, 10 - h1);

            const top_left_2 = {
                x: Math.floor((x2 - a_x)/10.0),
                y: Math.floor((y2 - a_y)/10.0),
            };
            const top_right_2 = {
                x: top_left_2.x + 1,
                y: top_left_2.y,
            };
            const bottom_left_2 = {
                x: top_left_2.x,
                y: top_left_2.y + 1,
            };
            const bottom_right_2 = {
                x: top_left_2.x + 1,
                y: top_left_2.y + 1,
            };
            if (inBounds(top_left_2)) {
                // Already drawn
                // ctx.fillStyle = getFillStyle(a[j][i] ^ b[top_left_2.y][top_left_2.x]);
            } else {
                ctx.fillStyle = getFillStyle(b[j][i]);
                ctx.fillRect(x2, y2, w2, h2);
            }

            if (inBounds(top_right_2)) {
                // Already drawn
                // ctx.fillStyle = getFillStyle(a[j][i] ^ b[top_right_2.y][top_right_2.x]);
            } else {
                ctx.fillStyle = getFillStyle(b[j][i]);
                ctx.fillRect(x2 + w2, y2, 10 - w2, h2);
            }

            if (inBounds(bottom_left_2)) {
                // Already drawn
                // ctx.fillStyle = getFillStyle(a[j][i] ^ b[bottom_left_2.y][bottom_left_2.x]);
            } else {
                ctx.fillStyle = getFillStyle(b[j][i]);
                ctx.fillRect(x2, y2 + h2, w2, 10 - h2);
            }

            if (inBounds(bottom_right_2)) {
                // Already drawn
                // ctx.fillStyle = getFillStyle(a[j][i] ^ b[bottom_right_2.y][bottom_right_2.x]);
            } else {
                ctx.fillStyle = getFillStyle(b[j][i]);
                ctx.fillRect(x2 + w2, y2 + h2, 10 - w2, 10 - h2);
            }
        }
    }
}

function inBounds(pt) {
    if (pt.x < 0 || pt.y < 0 || pt.x >= 13 || pt.y >= 13) {
        return false;
    }
    return true;
}

function drawImage(data, ctx) {
    for(var i = 0; i < 13; i++) {
        for(var j = 0; j < 13; j++) {
            ctx.fillStyle = getFillStyle(data[j][i]);
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

function generateRandomMask() {
    const ret = [];
    for(var i = 0; i < 13; i++) {
        ret.push([]);
        for(var j = 0; j < 13; j++) {
            ret[i].push(Math.random() > 0.5 ? 1 : 0);
        }
    }
    return ret;
}

function generateSolidColorMask(color) {
    const ret = [];
    for(var i = 0; i < 13; i++) {
        ret.push([]);
        for(var j = 0; j < 13; j++) {
            ret[i].push(color);
        }
    }
    return ret;
}

function generateCheckerboardMask() {
    const ret = [];
    for(var i = 0; i < 13; i++) {
        ret.push([]);
        for(var j = 0; j < 13; j++) {
            const color = (Math.floor(i / 7) % 2) ^ (Math.floor(j / 7) % 2);
            ret[i].push(color);
        }
    }
    return ret;
}


function generateMaskedSecret(secret, random_mask) {
    const ret = [];
    for(var i = 0; i < 13; i++) {
        ret.push([]);
        for(var j = 0; j < 13; j++) {
            ret[i].push(secret[i][j] ^ random_mask[i][j]);
        }
    }
    return ret;
}
