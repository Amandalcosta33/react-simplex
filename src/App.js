import './App.css';
import { useState } from 'react';

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

  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0.00);
  const [productCost, setProductCost] = useState(0.00);

  const [productsState, setProductState] = useState([
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
    }
  ]);

  function addProduct(product) {
    setProductState([...productsState, product]);
  }

  function productsRows() {
    return (
      productsState.map((product) =>
        <tr>
          <td>{product.description}</td>
          <td>{product.cost}</td>
          <td>{product.price}</td>
        </tr>
      )
    )
  }

  return (
    <>
      <select>
        <option value="max">Maximizar</option>
        <option disabled value="min">Minimizar (em breve)</option>
      </select>
      <label>Unidade de medida</label>
      <input type="text" name='uom_fo' />

      <hr />

      <label>Produto</label>
      <input type="text" name='description' value={productDescription} onInput={(e) => setProductDescription(e.target.value)} />

      <label>Preço</label>
      <input type="number" name='price' step={0.01} />

      <label>Custo</label>
      <input type="number" name='cost' step={0.01} />

      <button onClick={() => { addProduct({ description: productDescription }) }}>Incluir</button>

      <table id='product_table'>
        <thead>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Custo</th>
        </thead>
        <tbody>
          {productsRows()}
        </tbody>
      </table>

      <hr />

      <label>Recurso</label>
      <input type="text" name='description' />

      <label>Condição</label>
      <select name="" id="">
        <option value="<">Menor</option>
        <option value=">">Maior</option>
        <option value="<=">Menor ou igual</option>
        <option value=">=">Maior ou igual</option>
        <option value="=">Igual</option>
      </select>

      <label>Quantidade</label>
      <input type="number" name='quantity' step={0.01} />

      <label>Unidade de medida</label>
      <input type="text" name='uom_resource' step={0.01} />

      <table id='resource_table'>
        <thead>
          <th>Descrição</th>
          <th>Condição</th>
          <th>Quantidade</th>
          <th>UOM</th>
        </thead>
        <tbody>
          <tr><td></td></tr>
        </tbody>
      </table>

      <hr />
    </>
  )
}

export default App;
