import axios from 'axios'
import { useContext, useState } from 'react'
import '../../sass/display.scss'

import {
  AppContext,
  dateOption,
  IEventType,
  initialStateArgs,
  locale,
  numberOption,
  url,
} from '../../Store/Context'

function Display() {
  const {
    assetType,
    assetTypeArr,
    setAssetArgs,
    details,
    setDetails,
    setEditArgs,
    floatForm,
    setFloatForm,
    setEditingMode,
  } = useContext(AppContext)
  const [assetDependency, setAssetDependency] = useState<string | null>(null)

  function toggleDetails(index: number) {
    setDetails(index)
    if (details === index) {
      setDetails(null)
    } else if (details !== index) {
      setDetails(index)
    }

    setAssetDependency(null)

    let primaryKey
    if (assetType === 'event') {
      primaryKey = assetTypeArr[index].winner['@key']
    }
    if (assetType === 'driver') {
      primaryKey = assetTypeArr[index].team['@key']
    }
    if (assetType === 'car') {
      primaryKey = assetTypeArr[index].driver['@key']
    }

    axios({
      method: 'post',
      url: `${url}invoke/readAsset`,
      data: {
        key: {
          '@assetType': assetType,
          '@key': primaryKey,
        },
      },
    })
      .then((res) => setAssetDependency(res.data.name))
      .catch((error) => console.log(error))
  }

  function deleteEvent(event: React.SyntheticEvent, index: number) {
    event.stopPropagation()
    let keyEvent
    if (assetTypeArr[index]['@assetType'] === 'event') {
      keyEvent = {
        '@assetType': assetTypeArr[index]['@assetType'],
        '@key': assetTypeArr[index]['@key'],
      }
    }
    if (assetTypeArr[index]['@assetType'] !== 'event') {
      keyEvent = {
        '@assetType': assetTypeArr[index]['@assetType'],
        id: assetTypeArr[index].id,
      }
    }
    axios({
      method: 'delete',
      url: `${url}invoke/deleteAsset`,
      data: {
        key: keyEvent,
      },
    })
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
  }

  function changeEvent(event: React.SyntheticEvent, index: number) {
    event.stopPropagation()
    setAssetArgs(initialStateArgs)
    setEditArgs({ key: assetTypeArr[index]['@key'], asset: assetTypeArr[index]['@assetType'] })
    setFloatForm(!floatForm)
    setEditingMode(true)
  }

  return (
    <div className="container">
      {assetTypeArr.map((level: IEventType, index: number) => {
        return (
          <div key={index} className="card " onClick={() => toggleDetails(index)}>
            <div className="card-header">
              <p>
                {level.model && level.model}
                {level.name && level.name}
              </p>
              <div className="buttons">
                <button className="btn edit" type="button" onClick={(event) => changeEvent(event, index)}>
                  Editar
                </button>
                <button className="btn delete" type="button" onClick={(event) => deleteEvent(event, index)}>
                  Deletar
                </button>
              </div>
            </div>

            <div className={`card-body ${index === details ? 'on' : 'off'}`}>
              <ul>
                {level.model && <li>Modelo: {level.model}</li>}
                {level.name && <li>Nome: {level.name}</li>}
                {level.prize && <li>Premio: {level.prize.toLocaleString(locale, numberOption)}</li>}
                {level.date && <li>Data: {new Date(level.date).toLocaleDateString(locale, dateOption)}</li>}
                {level.driver &&
                  (assetDependency ? <li>Piloto: {assetDependency}</li> : <li>Buscando Piloto</li>)}
                {level.team && (assetDependency ? <li>Time: {assetDependency}</li> : <li>Buscando Time</li>)}
                {level.winner &&
                  (assetDependency ? <li>Time Vencedor: {assetDependency}</li> : <li>Buscando Vencedor</li>)}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Display
