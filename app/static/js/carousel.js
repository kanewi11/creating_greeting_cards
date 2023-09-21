const allCheckboxes = document.querySelectorAll(".card-checkbox");
const carousel = document.querySelector(".carousel");
const allItems = document.querySelectorAll(".carousel-item");

let items = [];
let itemCount = 0;
let currentIndex = 0;

function nextSlide() {
    currentIndex = (currentIndex + 1) % itemCount;
    updateCarousel();
}

function updateCarousel() {
    if (itemCount === 0) return;

    let offset = window.innerWidth / 2 - items[0].offsetWidth / 2;
    for (let i = 0; i < currentIndex; i++) {
        offset -= items[i].offsetWidth / 2 + parseInt(getComputedStyle(items[i]).marginRight) + items[i + 1].offsetWidth / 2;
    }

    carousel.style.transform = `translateX(${offset}px)`;
}

function updateCarouselWithCheckboxes() {
    const checkedCheckboxes = document.querySelectorAll(".card-checkbox:checked");
    if (checkedCheckboxes.length === 0) return;

    document.getElementById("start-carousel").style.display = "none";
    carousel.style.flexDirection = 'row';

    allItems.forEach(item => {
        item.style.display = "none";
    });

    checkedCheckboxes.forEach((checkbox) => {
        const item = document.querySelector(`div[data-index="${checkbox.id}"]`);
        item.style.display = "block";
        items.push(item);
    });

    allCheckboxes.forEach(checkbox => {
        checkbox.style.display = "none";
        checkbox.style.margin = "0";
    });

    itemCount = items.length;
}

function startCarousel() {
    currentIndex = 0;
    updateCarouselWithCheckboxes();
    updateCarousel();
    setInterval(nextSlide, 3000);
}

document.getElementById("start-carousel").addEventListener("click", startCarousel);
