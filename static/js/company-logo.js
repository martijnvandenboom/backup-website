const text = "<VDB/>";
const typedElement = document.getElementById("typed");
let i = 0;

function startAnimation() {
    typedElement.textContent = "";
    i = 0;
    setTimeout(typeNext, 4000);
}

function typeNext() {
    if (i < text.length) {
        typedElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, 120);
    } else {
        setTimeout(startAnimation, 8000);
    }
}

startAnimation();
