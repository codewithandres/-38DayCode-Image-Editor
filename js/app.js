
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

let Brightness = 100,
    Saturation = 100,
    Inversion = 0,
    GrayScale = 0;

let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

const filtros = {
    BRIGHTNESS: 'brightness',
    SATURATION: 'Saturation',
    INVERSION: 'Inversion',
    GRAYSCALE: 'GrayScale'
}

const direccion = {
    LEFT: 'left',
    RIGHT: 'right',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
}


const appyFilter = () => {

    const editFilter = {
        ROTATE: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`,
        FILTER: `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${GrayScale})`
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

        // if (option.id === filtros.BRIGHTNESS) {

        //     filterSlider.max = 200;
        //     filterSlider.value = Brightness;
        //     filterValue.textContent = `${Brightness} %`;

        // } else if (option.id === filtros.SATURATION) {

        //     filterSlider.max = 200;
        //     filterSlider.value = Saturation;
        //     filterValue.textContent = `${Saturation} %`;

        // } else if (option.id === filtros.INVERSION) {

        //     filterSlider.max = 100;
        //     filterSlider.value = Inversion;
        //     filterValue.textContent = `${Inversion} %`;

        // } else {

        //     filterSlider.max = 100;
        //     filterSlider.value = GrayScale;
        //     filterValue.textContent = `${GrayScale} %`;

        // }

        const filterOptions = {
            BRIGHTNESS: { max: 200, value: Brightness },
            SATURATION: { max: 200, value: Saturation },
            INVERSION: { max: 100, value: Inversion },
            GRAYSCALE: { max: 100, value: GrayScale }
        };

        if (filterOptions[option.id]) {
            const { max, value } = filterOptions[option.id];
            filterSlider.max = max;
            filterSlider.value = value;
            filterValue.textContent = `${value} %`;
        } else {
            console.error("Opcionn de filtro no reconocida:", option.id);
        }
        appyFilter();
    });
});

const updateFilter = () => {
    filterValue.textContent = `${filterSlider.value} %`;

    const selectedFilter = document.querySelector('.filter .active').id;

    if (selectedFilter == filtros.BRIGHTNESS) {

        Brightness = filterSlider.value;
    } else if (selectedFilter == filtros.SATURATION) {

        Saturation = filterSlider.value;
    } else if (selectedFilter == filtros.INVERSION) {

        Inversion = filterSlider.value;
    } else {

        GrayScale = filterSlider.value
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

    Brightness = 100;
    Saturation = 100;
    Inversion = 0;
    GrayScale = 0;

    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;

    filterOptions[0].click();
    appyFilter();
};

const saveImage = () => {

    const editFilter = {
        FILTER: `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${GrayScale})`
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

