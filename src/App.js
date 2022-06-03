
import { useState } from 'react';

let productId = 1;
let resourceId = 1;

const getProductId = () => {
  return productId++;
}

const getResourceId = () => {
  return resourceId++;
}

function App() {
  let problem = {
    fo: {
      objective: "MAX",
      uom: "R$",
      function_elements: [
        "1", "2"
      ]
    },
    productions: [
      {
        id: "1",
        description: "produto 1",
        price: 100,
        cost: 0,
        consumptions: [
          {
            resource_id: "1",
            quantity: 1,
          },
          {
            resource_id: "2",
            quantity: 0,
          },
          {
            resource_id: "3",
            quantity: 2,
          }
        ]
      },
      {
        id: "2",
        description: "produto 2",
        price: 150,
        cost: 0,
        consumptions: [
          {
            resource_id: "1",
            quantity: 0,
          },
          {
            resource_id: "2",
            quantity: 1,
          },
          {
            resource_id: "3",
            quantity: 3,
          }
        ]
      },
    ],
    resources: [
      {
        id: "1",
        description: "maquina 1",
        condition: "<=",
        quantity: 40,
        uom: "Horas"
      },
      {
        id: "2",
        description: "maquina 2",
        condition: "<=",
        quantity: 30,
        uom: "Horas"
      },
      {
        id: "3",
        description: "maquina 3",
        condition: "<=",
        quantity: 120,
        uom: "Horas"
      },
    ],
    algorithms: [],
    solutions: []
  }

  const [objective, setObjective] = useState("");
  const [foUom, setFoUom] = useState("");

  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0.00);
  const [productCost, setProductCost] = useState(0.00);

  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceCondition, setResourceCondition] = useState("");
  const [resourceQuantity, setResourceQuantity] = useState(0.00);
  const [resourceUom, setResourceUom] = useState("");

  const [consumptionProductId, setConsumptionProductIdState] = useState(0);
  const [consumptionResourceId, setConsumptionResourceIdState] = useState(0);
  const [consumptionQuantity, setConsumptionQuantityState] = useState(0.00);

  const [products, setProductsState] = useState([]);
  const [resources, setResourcesState] = useState([]);
  const [consumptions, setConsumptionsState] = useState([]);

  function addProduct(product) {
    product.id = getProductId();
    setProductsState([...products, product]);
    resetProductFields();
  }

  function addResource(resource) {
    resource.id = getResourceId();
    setResourcesState([...resources, resource]);
    resetResourceFields();
  }

  function addConsumption(consumption) {
    setConsumptionsState([...consumptions, consumption]);
    console.log(consumptionRows());
    resetConsumptionFields();
  }

  function resetProductFields() {
    setProductDescription("");
    setProductPrice("");
    setProductCost("");
  }

  function resetResourceFields() {
    setResourceDescription("");
    setResourceCondition("");
    setResourceQuantity("");
    setResourceUom("");
  }

  function resetConsumptionFields() {
    setConsumptionProductIdState("");
    setConsumptionResourceIdState("");
    setConsumptionQuantityState("");
  }

  function productsRows() {
    return (
      products.map((product) =>
        <tr key={product.id}>
          <td>{product.id}</td>
          <td>{product.description}</td>
          <td>{product.price}</td>
          <td>{product.cost}</td>
        </tr>
      )
    )
  }

  function resourcesRows() {
    return (
      resources.map((resource) =>
        <tr key={resource.id}>
          <td>{resource.id}</td>
          <td>{resource.description}</td>
          <td>{resource.condition}</td>
          <td>{resource.quantity}</td>
          <td>{resource.uom}</td>
        </tr>
      )
    )
  }

  function consumptionRows() {
    return (
      consumptions.map((consumption) =>
        <tr key={`${consumption.product_id}${consumption.resource_id}`}>
          <td>{products.find(p => p.id === Number(consumption.product_id)).description}</td>
          <td>{resources.find(p => p.id === Number(consumption.resource_id)).description}</td>
          <td>{consumption.quantity}</td>
        </tr>
      )
    )
  }

  function processSimplex(){

  }

  return (
    <>
      <h1>React-Simplex</h1>

      <hr />

      <h2>Função objetivo</h2>

      <label>Objetivo</label>
      <select name="objective" value={objective} onInput={(e) => setObjective(e.target.value)} >
        <option value="">Selecione...</option>
        <option value="max">Maximizar Lucro</option>
        <option disabled value="min">Minimizar Custo (em breve)</option>
      </select>

      <label>Unidade de medida</label>
      <input type="text" name='uom_fo' value={foUom} onInput={(e) => setFoUom(e.target.value)} />

      <hr />

      <h2>Produtos</h2>
      <label>Produto</label>
      <input type="text" name='description_product' value={productDescription} onInput={(e) => setProductDescription(e.target.value)} />

      <label>Preço</label>
      <input type="number" name='price' step={0.01} value={productPrice} onInput={(e) => setProductPrice(e.target.value)} />

      <label>Custo</label>
      <input type="number" name='cost' step={0.01} value={productCost} onInput={(e) => setProductCost(e.target.value)} />

      <button onClick={() => {
        addProduct({
          description: productDescription,
          price: productPrice,
          cost: productCost
        })
      }}>Incluir</button>

      <table id='product_table'>
        <thead>
          <tr key={0}>
            <th>ID</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          {productsRows()}
        </tbody>
      </table>

      <hr />

      <h2>Recursos</h2>

      <label>Recurso</label>
      <input type="text" name='description_resource' value={resourceDescription} onInput={(e) => setResourceDescription(e.target.value)} />

      <label>Condição</label>
      <select name="condition" value={resourceCondition} onInput={(e) => setResourceCondition(e.target.value)} >
        <option defaultValue={""} value="">Selecione...</option>
        <option value="=">Igual</option>
        <option value="<">Menor</option>
        <option value="<=">Menor ou igual</option>
        <option value=">">Maior</option>
        <option value=">=">Maior ou igual</option>
      </select>

      <label>Quantidade</label>
      <input type="number" name='quantity' step={0.01} value={resourceQuantity} onInput={(e) => setResourceQuantity(e.target.value)} />

      <label>Unidade de medida</label>
      <input type="text" name='uom_resource' step={0.01} value={resourceUom} onInput={(e) => setResourceUom(e.target.value)} />

      <button onClick={() => {
        addResource({
          description: resourceDescription,
          condition: resourceCondition,
          quantity: resourceQuantity,
          uom: resourceUom
        })
      }}>Incluir</button>

      <table id='resource_table'>
        <thead>
          <tr key={0}>
            <th>ID</th>
            <th>Descrição</th>
            <th>Condição</th>
            <th>Quantidade</th>
            <th>UOM</th>
          </tr>
        </thead>
        <tbody>
          {resourcesRows()}
        </tbody>
      </table>

      <hr />

      <h2>Consumo de recursos</h2>

      <label>Produto</label>
      <select name="product_id" id="product_id" value={consumptionProductId} onInput={(e) => setConsumptionProductIdState(e.target.value)} >
        <option value="">Selecione...</option>
        {products.map((product) => <option value={product.id}>{`${product.id}-${product.description}`}</option>)}
      </select>

      <label>Recurso</label>
      <select name="resource_id" id="resource_id" value={consumptionResourceId} onInput={(e) => setConsumptionResourceIdState(e.target.value)} >
        <option value="">Selecione...</option>
        {resources.map((resource) => <option value={resource.id}>{`${resource.id}-${resource.description}`}</option>)}
      </select>

      <label>Quantidade</label>
      <input type="number" name='quantity_consumption' step={0.01} value={consumptionQuantity}
        onInput={(e) => setConsumptionQuantityState(e.target.value)} />

      <button onClick={() => {
        addConsumption({
          product_id: consumptionProductId,
          resource_id: consumptionResourceId,
          quantity: consumptionQuantity,
        })
      }}>Incluir</button>

      <table id='consumption_table'>
        <thead>
          <tr key={0}>
            <th>Produto</th>
            <th>Recurso</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {consumptionRows()}
        </tbody>
      </table>

      <hr />

      <button onClick={processSimplex}>Processar</button>
    </>
  )
}

export default App;
