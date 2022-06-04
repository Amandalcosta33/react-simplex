
import { useState } from 'react';
import { processCase } from './common/utils/simplex'
import './index.css';

let productId = 1;
let resourceId = 1;

const getProductId = () => {
  return (productId++).toString();
}

const getResourceId = () => {
  return (resourceId++).toString();
}

function App() {

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

  const [resultState, setResultState] = useState({});

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
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {product.id}
            </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {product.description}
            </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {product.price}
            </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {product.cost}
            </p>
          </td>
        </tr>
      )
    )
  }

  function resourcesRows() {
    return (
      resources.map((resource) =>
        <tr key={resource.id}>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resource.id}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resource.description}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resource.condition}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resource.quantity}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resource.uom}
            </p>
          </td>
        </tr>
      )
    )
  }

  function consumptionRows() {
    return (
      consumptions.map((consumption) =>
        <tr key={`${consumption.product_id}${consumption.resource_id}`}>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {products.find(p => p.id === consumption.product_id).description}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {resources.find(p => p.id === consumption.resource_id).description}
            </p>
          </td>
          <td className="py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {consumption.quantity}
            </p>
          </td>
        </tr>
      )
    )
  }

  function processSimplex() {

    let problemToProcess = {
      fo: {
        objective: "",
        uom: "",
        function_elements: []
      },
      productions: [],
      resources: [],
      algorithms: [],
      solutions: [],
    };

    //FO
    problemToProcess.fo.objective = objective;
    problemToProcess.fo.uom = foUom;

    products.forEach(product => {
      problemToProcess.fo.function_elements.push(product.id.toString());

      //Productions
      product.consumptions = [];
      consumptions.forEach((c) => {
        if (c.product_id === product.id && c != null) {
          product.consumptions.push({
            resource_id: c.resource_id,
            quantity: c.quantity
          });
        }
      })
      problemToProcess.productions.push(product);

      //Resources
      problemToProcess.resources = resources;
      let result = processCase(problemToProcess);
      setResultState(result);
      // console.log(result);
    });
  }

  function translateResult(result) {
    switch (result) {
      case 'great':
        return "Ótima"
      case 'ok':
        return "OK, mas não ótima"
      case 'not great':
        return "Não ótima"
      default:
        return "Não identificado"
    }
  }

  return (
    <>
      <section className="h-screen bg-indigo-100 bg-opacity-50">
        <div className="p-4 bg-indigo-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <h1 className="text-gray-600 font-semibold">
                React-Simplex
              </h1>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-4 py-2 text-base rounded-full text-white my-6 bg-indigo-500 ">
              Função objetivo
            </span>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <label>Objetivo:</label>
                  <select name="objective" value={objective} onInput={(e) => setObjective(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="MAX">Maximizar Lucro</option>
                    <option disabled value="MIN">Minimizar Custo (em breve)</option>
                  </select>
                </div>
              </div>
              <div>
                <div className=" relative ">
                  <label>Unidade de medida:</label>
                  <input type="text" name='uom_fo' value={foUom} onInput={(e) => setFoUom(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Unidade de medida" />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-4 py-2  text-base rounded-full text-white  bg-indigo-500 ">
              Produtos/Variáveis
            </span>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <label>Produto:</label>
                  <input type="text" name='description_product' value={productDescription} onInput={(e) => setProductDescription(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Descrição do produto" />
                </div>
              </div>
              <div>
                <div className=" relative ">
                  <label>Preço:</label>
                  <input type="number" name='price' step={0.01} value={productPrice} onInput={(e) => setProductPrice(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Preço" />
                </div>
              </div>
              <div>
                <div className='relative'>
                  <label>Custo:</label>
                  <input type="number" name='cost' step={0.01} value={productCost} onInput={(e) => setProductCost(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Custo" />
                </div>
              </div>
              <div>
                <div className='relative'>
                  <button onClick={() => {
                    addProduct({
                      description: productDescription,
                      price: Number(productPrice),
                      cost: Number(productCost)
                    })
                  }} className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">Incluir</button>
                </div>
              </div>
              <div>
                <div className='relative'>
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">ID</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Descrição</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Preço</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Custo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsRows()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-4 py-2  text-base rounded-full text-white  bg-indigo-500 ">
              Recursos disponíveis
            </span>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <label>Recurso:</label>
                  <input type="text" name='description_resource' value={resourceDescription} onInput={(e) => setResourceDescription(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Descrição do recurso" />
                </div>
              </div>
              <div>
                <div className=" relative ">
                  <label>Condição:</label>
                  <select name="condition" value={resourceCondition} onInput={(e) => setResourceCondition(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" >
                    <option defaultValue={""} value="">Selecione...</option>
                    <option disabled value="=">Igual</option>
                    <option disabled value="<">Menor</option>
                    <option value="<=">Menor ou igual</option>
                    <option disabled value=">">Maior</option>
                    <option disabled value=">=">Maior ou igual</option>
                  </select>
                </div>
              </div>
              <div>
                <div className='relative'>
                  <label>Quantidade:</label>
                  <input type="number" name='quantity' step={0.01} value={resourceQuantity} onInput={(e) => setResourceQuantity(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                </div>
              </div>
              <div>
                <div className='relative'>
                  <label>Unidade de medida:</label>
                  <input type="text" name='uom_resource' step={0.01} value={resourceUom} onInput={(e) => setResourceUom(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                </div>
              </div>
              <div>
                <div className='relative'>
                  <button onClick={() => {
                    addResource({
                      description: resourceDescription,
                      condition: resourceCondition,
                      quantity: Number(resourceQuantity),
                      uom: resourceUom
                    })
                  }} className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">Incluir</button>
                </div>
              </div>
              <div>
                <div className='relative'>
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">ID</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Descrição</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Condição</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Quantidade</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">UOM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resourcesRows()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-4 py-2  text-base rounded-full text-white  bg-indigo-500 ">
              Consumo de recursos
            </span>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <label>Produto:</label>
                  <select name="product_id" id="product_id" value={consumptionProductId} onInput={(e) => setConsumptionProductIdState(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" >
                    <option value="">Selecione...</option>
                    {products.map((product) => <option value={product.id}>{`${product.id}-${product.description}`}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className=" relative ">
                  <label>Recurso:</label>
                  <select name="resource_id" id="resource_id" value={consumptionResourceId} onInput={(e) => setConsumptionResourceIdState(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" >
                    <option value="">Selecione...</option>
                    {resources.map((resource) => <option value={resource.id}>{`${resource.id}-${resource.description}`}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className='relative'>
                  <label>Quantidade:</label>
                  <input type="number" name='quantity_consumption' step={0.01} value={consumptionQuantity}
                    onInput={(e) => setConsumptionQuantityState(e.target.value)}
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                </div>
              </div>
              <div>
                <div className='relative'>

                  <button onClick={() => {
                    addConsumption({
                      product_id: consumptionProductId,
                      resource_id: consumptionResourceId,
                      quantity: Number(consumptionQuantity),
                    })
                  }} className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">Incluir</button>
                </div>
              </div>

              <div>
                <div className='relative'>
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Produto</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Recurso</th>
                        <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionRows()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="relative flex justify-center text-sm leading-5 px-20">
            <button onClick={processSimplex} className="py-2 px-20 bg-green-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">Processar</button>
          </div>
          <hr />
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-4 py-2  text-base rounded-full text-white  bg-indigo-500 ">
              Algoritmos e Soluções
            </span>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  {resultState.algorithms?.map((algorithm, index) =>
                    <>
                      <div className="relative flex justify-center text-sm leading-5">
                        <h1 className="px-5 text-gray-500 bg-white">
                          Algoritmo {algorithm.id}
                        </h1>
                      </div>
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr key={0}>
                            {algorithm.algorithm[0].map((header_column) =>
                              <th scope="col" className="py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">{header_column}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {algorithm.algorithm.map((element, index) =>
                            index > 0 ? <tr>
                              {element.map(value =>
                                <td className="py-5 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {value}
                                  </p>
                                </td>
                              )}
                            </tr> : null
                          )}
                          <tr></tr>
                        </tbody>
                      </table>
                      <br />
                      <div className="relative flex justify-center text-sm leading-5">
                        <h1 className="px-5 text-gray-500 bg-white">
                          Solução {resultState.solutions[index].id}
                        </h1>
                      </div>
                      <table>
                        <tr>
                          <th className='py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal' rowSpan={resultState.solutions[index].basic_variables.length + 1}>VB:</th>
                        </tr>
                        {resultState.solutions[index].basic_variables.map((basic_variable) =>
                          <tr>
                            <td className="py-5 border-b border-gray-200 bg-white text-sm">{`${basic_variable.id}=${basic_variable.quantity}`}</td>
                          </tr>
                        )}

                        <tr>
                          <th className='py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal' rowSpan={resultState.solutions[index].non_basic_variables.length + 1}>VNB:</th>
                        </tr>
                        {resultState.solutions[index].non_basic_variables.map((non_basic_variable) =>
                          <tr>
                            <td className="py-5 border-b border-gray-200 bg-white text-sm">{`${non_basic_variable.id}=${non_basic_variable.quantity}`}</td>
                          </tr>
                        )}

                        <tr>
                          <th className='py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm font-normal' rowSpan={2}>Valor Z:</th>
                        </tr>
                        <tr>
                          <td className="py-5 border-b border-gray-200 bg-white text-sm">{`${foUom} ${resultState.solutions[index].Z}`}</td>
                        </tr>

                        <tr>
                          <th className='py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm font-normal' rowSpan={2}>Resultado:</th>
                        </tr>
                        <tr>
                          <td className="py-5 border-b border-gray-200 bg-white text-sm">{`${translateResult(resultState.solutions[index].result)}`}</td>
                        </tr>
                      </table>
                      <hr />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App;
