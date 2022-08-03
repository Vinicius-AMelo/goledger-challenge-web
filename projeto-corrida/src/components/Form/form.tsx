/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

import { AppContext, initialStateArgs, url } from '../../Store/Context'

import '../../sass/form.scss'

function Form() {
  const {
    assetType,
    setAssetType,
    setAssetTypeArr,
    assetTypeArr,
    assetArgs,
    setAssetArgs,
    bodyReq,
    assetDependencyList,
    setAssetDependencyList,
    setKey,
    setDetails,
    editArg,
    floatForm,
    setFloatForm,
    setEditingMode,
    editingMode,
  } = useContext(AppContext)

  const [resetForm, setResetForm] = useState<string>('initial')

  function showFloatForm() {
    setFloatForm(!floatForm)
    setEditingMode(false)
  }

  function handleKey(event: React.FormEvent) {
    const target = event.target as typeof event.target & { value: string; name: string }
    const keyValue = target.value
    setKey(keyValue)
    setResetForm(keyValue)
  }

  function handleForm(event: React.FormEvent) {
    const target = event.target as typeof event.target & { value: string; name: string }
    const selectValue = target.value
    const selectName = target.name
    console.log(selectName)
    event.preventDefault()
    setAssetType(selectValue)
    setResetForm('initial')
    setDetails(null)
  }

  function handleArgs(event: React.FormEvent) {
    const target = event.target as typeof event.target & { value: string; name: string }
    const inputValues = target.value
    const inputName = target.name
    if (inputName === 'prize') {
      setAssetArgs((oldState) => ({ ...oldState, prize: inputValues }))
    }
    if (inputName === 'name') {
      setAssetArgs((oldState) => ({ ...oldState, name: inputValues }))
    }
    if (inputName === 'model') {
      setAssetArgs((oldState) => ({ ...oldState, model: inputValues }))
    }
    if (inputName === 'date') {
      setAssetArgs((oldState) => ({ ...oldState, date: inputValues }))
    }
    console.log()
  }

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    axios({
      method: 'post',
      url: `${url}invoke/createAsset`,
      data: bodyReq,
    })
      .then((res) => console.log(res))
      .catch((error) => console.log(error))

    setAssetArgs(initialStateArgs)
    setFloatForm(false)
  }

  function handleChange() {
    axios
      .put(`${url}invoke/updateAsset`, {
        update: {
          '@assetType': editArg.asset,
          '@key': editArg.key,
          prize: assetArgs.prize,
          name: assetArgs.name,
          model: assetArgs.model,
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error))

    setFloatForm(!floatForm)
    setEditingMode(false)
  }
  useEffect(() => {
    axios
      .post(`${url}query/search`, {
        query: {
          selector: {
            '@assetType': assetType,
          },
        },
      })
      .then((res) => setAssetTypeArr(res.data.result))
      .catch((e) => console.log(e))
  }, [assetTypeArr])

  useEffect(() => {
    const dependency = assetType === 'car' ? 'driver' : 'team'
    axios
      .post(`${url}query/search`, {
        query: {
          selector: {
            '@assetType': dependency,
          },
        },
      })
      .then((res) => setAssetDependencyList(res.data.result))
      .catch((e) => console.log(e))
  }, [assetTypeArr])

  return (
    <>
      <nav>
        <h1>Bem vindo!</h1>
        <div className="select-asset">
          <label htmlFor="select">Você esta visualizando:</label>
          <select name="select" onChange={handleForm} defaultValue={assetType}>
            <option value="event">Eventos</option>
            <option value="team">Times</option>
            <option value="driver">Pilotos</option>
            <option value="car">Carros</option>
          </select>
          <button onClick={showFloatForm} type="button">
            Criar Novo
          </button>
        </div>
      </nav>

      {floatForm && (
        <div className="floatForm">
          <button type="button" className="close" onClick={showFloatForm}>
            X
          </button>
          <form action="/" onSubmit={handleSubmit} className="creationForm">
            {assetType !== 'car' && (
              <>
                <label htmlFor="name">Nome:</label>
                <input type="text" name="name" value={assetArgs.name} onChange={handleArgs} />
              </>
            )}
            {assetType === 'car' && (
              <>
                <label htmlFor="model">Modelo:</label>
                <input type="text" name="model" value={assetArgs.model} onChange={handleArgs} />
              </>
            )}
            {assetType === 'event' && (
              <>
                <label htmlFor="prize">Premio:</label>
                <input type="number" name="prize" value={assetArgs.prize} onChange={handleArgs} />
                <label htmlFor="date">Data do Evento:</label>
                <input type="date" name="date" value={assetArgs.date} onChange={handleArgs} />
              </>
            )}
            <label htmlFor="">Time Vencedor:</label>
            <select onChange={handleKey} name="select2" value={resetForm}>
              {assetType !== 'car' ? (
                <option disabled value="initial">
                  Selecionar Time
                </option>
              ) : (
                <option disabled value="initial">
                  Selecionar Piloto
                </option>
              )}

              {assetDependencyList.map((event, index: number) => {
                return (
                  <option key={index} value={event.id ? event.id : event['@key']}>
                    {event.name}
                  </option>
                )
              })}
            </select>
            {editingMode ? (
              <button type="button" onClick={handleChange}>
                Editar
              </button>
            ) : (
              <button type="submit">Criar</button>
            )}
          </form>
        </div>
      )}
    </>
  )
}

export default Form
