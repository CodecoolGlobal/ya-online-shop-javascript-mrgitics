
const currency = ' $';

function createProductElement(product, mode) {
    const productElement = document.createElement('div');
    productElement.id = product.id;
    productElement.classList.add('product');
    const img = document.createElement('img');
    img.src = product.image;
    img.classList.add('product-img');
    productElement.insertAdjacentElement('beforeend', img);
    const productName = document.createElement('h3');
    productName.innerText = product.name;
    productElement.insertAdjacentElement('beforeend', productName);
    const productDescription = document.createElement('p');
    productDescription.innerText = product.description;
    productElement.insertAdjacentElement('beforeend', productDescription);
    const productPrice = document.createElement('p');
    productPrice.innerText = product.price + currency;
    productElement.insertAdjacentElement('beforeend', productPrice);
    if (mode === 'buy') {
        if (product.inventory > 0) {
            productElement.insertAdjacentElement('beforeend', createButtonElement('Add to cart', product.id, mode));
        } else {
            const outOfStock = document.createElement('h3');
            outOfStock.innerText = 'Out Of Stock';
            productElement.insertAdjacentElement('beforeend', outOfStock);
        }
    } else {
        productElement.insertAdjacentElement('beforeend', createButtonElement('Edit Product', product.id, mode));
    };

    return productElement;
};

async function appMethods(method, id, body = {
    'name': '',
    'description': '',
    'price': '',
    'inventory': '',
    'image': '',
}) {
    const response = await fetch(`/api/${id}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    console.log(response);
    const data = await response.json();
    return data;
};



async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch {
        console.error(error);
    };
};

async function renderHTML(root, mode) {
    const products = await fetchData('/api');
    const productElements = document.createElement('div');
    productElements.classList.add('products');
    products.forEach(product => {
        const currentProduct = createProductElement(product, mode);
        productElements.insertAdjacentElement('beforeend', currentProduct);
    });
    root.insertAdjacentElement('beforeend', productElements);
};

async function makeHTMLPages() {

    await makeEditorHtml();

    await makeClientHtml();
};

async function makeEditorHtml() {
    const editorPage = document.createElement('div');
    editorPage.id = 'editorPage';
    editorPage.style.display = 'block';

    const editorHeader = document.createElement('h1');
    editorHeader.innerText = 'Editor Page';
    editorPage.appendChild(editorHeader);


    const editorSwitchButton = document.createElement('button');
    editorSwitchButton.innerText = 'Switch to Client Page';
    editorSwitchButton.onclick = async () => {
        await switchPage('clientPage');

    };
    editorPage.appendChild(editorSwitchButton);
    editorPage.appendChild(createButtonElement('Add Product', '', 'add'));
    const editorProductList = document.createElement('div');
    editorProductList.id = 'editorProductList';
    editorProductList.classList.add('items');
    editorPage.appendChild(editorProductList);
    await renderHTML(editorProductList, 'edit');

    document.body.appendChild(editorPage);
};

async function makeClientHtml() {
    const clientPage = document.createElement('div');
    clientPage.id = 'clientPage';
    clientPage.style.display = 'none';

    const clientHeader = document.createElement('h1');
    clientHeader.innerText = 'Welcome to SwiftCart';
    clientPage.appendChild(clientHeader);

    const clientSwitchButton = document.createElement('button');
    clientSwitchButton.innerText = 'Switch to Editor Page';
    clientSwitchButton.onclick = async () => {
        await switchPage('editorPage');

    };
    clientPage.appendChild(clientSwitchButton);

    clientPage.appendChild(createButtonElement('Check Out', '', 'checkout'));

    const clientProductList = document.createElement('div');
    clientProductList.id = 'clientProductList';
    clientProductList.classList.add('items');
    clientPage.appendChild(clientProductList);
    await renderHTML(clientProductList, 'buy');

    document.body.appendChild(clientPage);
};

async function switchPage(pageId) {
    const editorPage = document.getElementById('editorPage');
    const clientPage = document.getElementById('clientPage');

    if (pageId === 'clientPage') {
        editorPage.style.display = 'none';
        clientPage.style.display = 'block';

    } else {
        clientPage.style.display = 'none';
        editorPage.style.display = 'block';

    };
};

function createButtonElement(innerText, id, classHTML) {
    const buttonElement = document.createElement('button');
    buttonElement.innerText = innerText;
    buttonElement.id = id;
    buttonElement.classList.add(classHTML);
    return buttonElement;
};

function createSubmitButton(type, innerText, method) {
    const buttonElement = document.createElement('button');
    buttonElement.type = type;
    buttonElement.innerText = innerText;

    buttonElement.setAttribute('data-method', method);
    return buttonElement;
};

function inputElement(placeholder, className, value) {
    const inputElement = document.createElement('input');
    inputElement.placeholder = placeholder;
    inputElement.className = className;
    inputElement.value = value;

    return inputElement;
};

function createModal(callback, argument) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.appendChild(callback(argument));
    modal.classList.toggle('show');
    return modal;
};

function removeModal() {
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    };
};


function createFormToAdd() {
    const formElement = document.createElement('form');
    formElement.classList.add('form')
    formElement.appendChild(inputElement('name', 'name', ''));
    formElement.appendChild(inputElement('description', 'description', ''));
    formElement.appendChild(inputElement('price', 'price', ''));
    formElement.appendChild(inputElement('inventory', 'inventory', ''))
    formElement.appendChild(inputElement('image', 'image', ''))
    formElement.appendChild(createSubmitButton('submit', 'add', "POST"))
    formElement.appendChild(createButtonElement('close', '', 'close'))
    return formElement;
};

function createForm(artifact) {
    const formElement = document.createElement('form');
    formElement.setAttribute('data-id', artifact.id);
    formElement.classList.add('form')
    formElement.appendChild(inputElement('name', 'name', artifact.name));
    formElement.appendChild(inputElement('description', 'description', artifact.description));
    formElement.appendChild(inputElement('price', 'price', artifact.price));
    formElement.appendChild(inputElement('inventory', 'inventory', artifact.inventory));
    formElement.appendChild(inputElement('image', 'image', artifact.image));
    formElement.appendChild(createSubmitButton('submit', 'change', "PUT"));
    formElement.appendChild(createSubmitButton('submit', 'update', "PATCH"));
    formElement.appendChild(createSubmitButton('submit', 'delete', "DELETE"));
    formElement.appendChild(createButtonElement('close', '', 'close'));
    return formElement;
};

function checkoutForm(cartContent) {
    const formElement = document.createElement('form');
    formElement.setAttribute('data-id', 'checkout-form');
    formElement.classList.add('form');
    let totalP = 0;
    cartContent.forEach(product => {
        const nameElement = document.createElement('span');
        nameElement.innerText = product.name + '    ';
        formElement.appendChild(nameElement);

        const priceElement = document.createElement('span');
        priceElement.innerText = product.price + currency;
        priceElement.style.color = 'red';
        formElement.appendChild(priceElement);
        formElement.appendChild(document.createElement('br'));

        totalP += parseFloat(product.price);

    });
    const totalPrice = document.createElement('h3');
    totalPrice.innerText = `Total Price: ${totalP.toFixed(2)}${currency}`;
    formElement.appendChild(totalPrice);

    formElement.appendChild(createSubmitButton('submit', 'Buy Now', "PUT"));
    formElement.appendChild(createButtonElement('close', '', 'close'))

    return formElement;

}

async function handleSubmit(e) {
    e.preventDefault();

    const method = e.submitter.getAttribute('data-method');
    const id = parseInt(e.target.getAttribute('data-id'));


    let result;

    if (method === "PATCH" || method === "PUT") {
        result = await appMethods(method, id, {
            name: e.target.querySelector('.name').value,
            description: e.target.querySelector('.description').value,
            price: e.target.querySelector('.price').value,
            inventory: parseInt(e.target.querySelector('.inventory').value),
            image: e.target.querySelector('.image').value,
        });
    };
    if (method === "POST") {
        result = await appMethods('POST', '', {
            name: e.target.querySelector('.name').value,
            description: e.target.querySelector('.description').value,
            price: e.target.querySelector('.price').value,
            inventory: parseInt(e.target.querySelector('.inventory').value),
            image: e.target.querySelector('.image').value,
        });
    };

    if (method === "DELETE") {
        result = await appMethods("DELETE", id, {
            id: id
        });
    };

    if (result.state === 'DONE') {
        location.reload();
    };
};


function getBody(form) {
    const body = {
        name: form.querySelector('.name').value,
        description: form.querySelector('.description').value,
        price: form.querySelector('.price').value,
        inventory: form.querySelector('.inventory').value,
        image: form.querySelector('.image').value,
    };
};

async function addProductToCart(id) {
    const response = await fetch(`/cart/${id}`, {
        method: "POST",
        body: "DONE"
    });
    const cartCount = await response.json();
    const button = document.querySelector('.checkout');
    button.innerText = `Check Out (${cartCount})`;
}

function allClicks() {
    document.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            if (event.target.classList.contains('buy')) {
                console.log('buy');
                addProductToCart(event.target.id);
            };
            if (event.target.classList.contains('edit')) {
                removeModal();
                const index = parseInt(event.target.parentElement.id);
                const artifact = await fetchData(`/api/${index}`);
                eventModal(artifact, createForm);

            };
            if (event.target.classList.contains('add')) {
                console.log(event.target.classList);
                removeModal();
                eventModal('', createFormToAdd);
            };
            if (event.target.classList.contains('close')) {
                removeModal()
            };
            if (event.target.classList.contains('checkout')) {
                const cartContent = await fetchData(`/cart/api`);
                const cartModal = createModal(checkoutForm, cartContent);
                document.body.appendChild(cartModal);

            }

            if(event.target.tagName==='BUTTON' && event.target.innerText==='Buy Now') {
                event.preventDefault();
                console.log('Click Buy Now');
                const cartContent = await fetchData(`/cart/api`);
                cartContent.forEach(async (product) => {
                    product.inventory--;
                    console.log(product);
                    await fetch(`/api/${product.id}`, {
                        method: "PUT",
                        headers: { 'Content-type': 'application/json' },
                        body: JSON.stringify(product)
                    });
                });
                await fetch('/cart',{
                    method: "DELETE"
                });

            };
        };


    });
};


function eventModal(callback, param) {
    const modal = createModal(param, callback);
    document.body.appendChild(modal);

    const form = modal.querySelector('.form');
    form.addEventListener('submit', async (e) => {
        await handleSubmit(e);
        removeModal();
    });
};





function main() {
    makeHTMLPages();
    allClicks();



};
main();