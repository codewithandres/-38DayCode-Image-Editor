
const fileInput = document.querySelector('.file-input'),
    previeImg = document.querySelector('.previw-image img'),
    filterOptions = document.querySelectorAll('.filter button'),
    rotateOptions = document.querySelectorAll('.rotate button'),
    filterName = document.querySelector('.slider .name'),
    filterSlider = document.querySelector('.slider input'),
    filterValue = document.querySelector('.filter-info .value'),
    restFilterBtn = document.querySelector('.rest-filters'),
    choosoBtn = document.querySelector('.choose-img'),
    saveImageBtn = document.querySelector('.Seve-image');

let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0;

let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

const filtros = {
    BRIGHTNESS: 'brightness',
    SATURATION: 'saturation',
    INVERSION: 'inversion',
    GRAYSCALE: 'grayscale'
}

const direccion = {
    LEFT: 'left',
    RIGHT: 'right',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
}

const filtrosOpcion = {
    BRIGHTNESS: { max: 200, value: brightness },
    SATURATION: { max: 200, value: saturation },
    INVERSION: { max: 100, value: inversion },
    GRAYSCALE: { max: 100, value: grayscale }
};


const appyFilter = () => {

    const editFilter = {
        ROTATE: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`,
        FILTER: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale})`
    };

    previeImg.style.transform = editFilter.ROTATE;
    previeImg.style.filter = editFilter.FILTER;
};

const loadImagen = () => {

    let file = fileInput.files[0];
    if (!file) return;
    previeImg.src = URL.createObjectURL(file);

    previeImg.addEventListener('load', () => {
        document.querySelector('.container').classList.remove('disable');
    });
};


[...filterOptions].map(option => {
    option.addEventListener('click', () => {

        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.textContent = option.textContent;


        if (filtrosOpcion[option.id]) {
            const { max, value } = filtrosOpcion[option.id];
            filterSlider.max = max;
            filterSlider.value = value;
            filterValue.textContent = `${value} %`;
        } else {
            console.log("Opcion de filtro no reconocida:", option.id);
        }
        appyFilter();
    });
});

const updateFilter = () => {
    filterValue.textContent = `${filterSlider.value} %`;

    const selectedFilter = document.querySelector('.filter .active').id;
    const { BRIGHTNESS, INVERSION, SATURATION } = filtros;

    if (selectedFilter == BRIGHTNESS) {

        brightness = filterSlider.value;
    } else if (selectedFilter == SATURATION) {

        saturation = filterSlider.value;
    } else if (selectedFilter == INVERSION) {

        inversion = filterSlider.value;
    } else {

        grayscale = filterSlider.value
    };

    appyFilter();
};

[...rotateOptions].map(option => {
    option.addEventListener('click', () => {
        const { address } = option.dataset;
        if (address === direccion.LEFT) {
            rotate -= 90;
        } else if (address === direccion.RIGHT) {
            rotate += 90;
        } else if (address === direccion.HORIZONTAL) {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        appyFilter();
    });
});

const restFilter = () => {

    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;

    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;

    filterOptions[0].click();
    appyFilter();
};

const saveImage = () => {

    const editFilter = {
        FILTER: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale})`
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = previeImg.naturalWidth;
    canvas.height = previeImg.naturalHeight;

    ctx.filter = editFilter.FILTER;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    };
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previeImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();
};

fileInput.addEventListener('change', loadImagen);
filterSlider.addEventListener('input', updateFilter);
restFilterBtn.addEventListener('click', restFilter);
saveImageBtn.addEventListener('click', saveImage);
choosoBtn.addEventListener('click', () => fileInput.click());

