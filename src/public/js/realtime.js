const socketClient = io()

document.addEventListener('DOMContentLoaded', function() {
  socketClient.emit("getProducts");
});

socketClient.on("enviodeproducts", (obj) => {
  console.log(obj)
  updateProductList(obj)
})


function updateProductList(products) {
  let div = document.getElementById("list-products");
  let productos = "";

  products.forEach((product) => {
    productos += `
          <div class="cards-container">
            <div class="card" style="width: 16rem;">
              <img src="${product.thumbnail}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p >Id:${product._id}</p>
              </div>
            </div>
          </div>
          `;
  });

  div.innerHTML = productos;
}


let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  socketClient.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = deleteidinput.value;
  console.log(deleteid)
  socketClient.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
});

