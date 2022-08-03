import axios from 'axios'
import React, { useContext, useEffect } from 'react'

import { AppContext, initialStateArgs, url } from '../../Store/Context'

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
  } = useContext(AppContext)

  function handleKey(event: React.FormEvent) {
    const target = event.target as typeof event.target & { value: string }
    const keyValue = target.value
    setKey(keyValue)
  }

  function handleForm(event: React.FormEvent) {
    const target = event.target as typeof event.target & { value: string; name: string }
    const selectValue = target.value
    const selectName = target.name
    console.log(selectName)
    event.preventDefault()
    setAssetType(selectValue)
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
    <form action="/" onSubmit={handleSubmit}>
      <select name="select" onChange={handleForm} defaultValue={assetType}>
        <option value="event">Evento</option>
        <option value="team">Time</option>
        <option value="driver">Piloto</option>
        <option value="car">Carro</option>
      </select>
      {assetType !== 'car' && (
        <label htmlFor="name">
          Nome:
          <input type="text" name="name" value={assetArgs.name} onChange={handleArgs} />
        </label>
      )}
      {assetType === 'car' && (
        <label htmlFor="model">
          Modelo:
          <input type="text" name="model" value={assetArgs.model} onChange={handleArgs} />
        </label>
      )}
      {assetType === 'event' && (
        <label htmlFor="prize">
          Premio:
          <input type="number" name="prize" value={assetArgs.prize} onChange={handleArgs} />
        </label>
      )}
      <select onChange={handleKey} name="select2" defaultValue={0}>
        {assetType !== 'car' ? (
          <option value={0}>Selecionar Time</option>
        ) : (
          <option value={0}>Selecionar Piloto</option>
        )}

        {assetDependencyList.map((event, index: number) => {
          return (
            <option key={index} value={event.id ? event.id : event['@key']}>
              {event.name}
            </option>
          )
        })}
      </select>
      <button type="submit">Criar</button>
    </form>
  )
}

export default Form
