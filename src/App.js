import './App.css';
import { useState } from 'react';

function App() {
  return (
    <form className={style.Formulario} onSubmit={submeterForm}>
      <h3 className={style.titulo}>Novo evento</h3>

      <label>Descrição</label>
      <input
        type="text"
        name="descricao"
        id="descricao"
        className={style.input}
        onChange={evento => setDescricao(evento.target.value)}
        placeholder="Descrição" value={descricao}
        autoComplete="off"
        required />

      <label>Data de início</label>
      <div className={style.inputContainer}>
        <input
          type="date"
          name="dataInicio"
          className={style.input}
          onChange={evento => setDataInicio(evento.target.value)}
          value={dataInicio}
          required />
        <input
          type="time"
          name="horaInicio"
          className={style.input}
          onChange={evento => setHoraInicio(evento.target.value)}
          value={horaInicio}
          required />
      </div>

      <label>Data de término</label>
      <div className={style.inputContainer}>
        <input
          type="date"
          name="dataFim"
          className={style.input}
          onChange={evento => setDataFim(evento.target.value)}
          value={dataFim}
          required />
        <input
          type="time"
          name="horaFim"
          className={style.input}
          onChange={evento => setHoraFim(evento.target.value)}
          value={horaFim}
          required />
      </div>

      <button className={style.botao}>
        Salvar
      </button>

    </form>
  )
}

export default App;
