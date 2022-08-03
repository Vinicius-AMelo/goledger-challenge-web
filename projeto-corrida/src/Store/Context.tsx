import { nanoid } from 'nanoid'
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface IProps {
  children: JSX.Element | JSX.Element[]
}

export const dateOption: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
}

export const numberOption = {
  style: 'currency',
  currency: 'BRL',
}

export const locale = 'pt-br'

export const url = 'http://ec2-100-25-136-128.compute-1.amazonaws.com/api/'

export interface IEventType {
  '@assetType': string
  '@key': string
  '@lastTouchBy': string
  '@lastTx': string
  date: string
  name: string
  prize: number
  id: number
  model: string
  winner: {
    '@assetType': string
    '@key': string
  }
  driver: {
    '@assetType': string
    '@key': string
  }
  team: {
    '@assetType': string
    '@key': string
  }
}

interface IReqBody {
  asset: {
    '@assetType': string
    '@key'?: string
    name?: string
    date?: string
    id?: string
    prize?: string
    model?: string
    driver?: { id: string }
    winner?: { '@assetType': string; id: string }
  }[]
}

const initialStateBodyReq = {
  asset: [
    {
      '@assetType': '',
      '@key': '',
      name: '',
      date: '',
      id: '',
      prize: '',
      model: '',
      driver: { id: '' },
      winner: { '@assetType': '', id: '' },
    },
  ],
}

export interface IInputValues {
  name: string
  prize: string
  model: string
  id: string
  date: string
}
interface IContextProps {
  assetType: string
  setAssetType: Dispatch<SetStateAction<string>>
  assetTypeArr: IEventType[]
  setAssetTypeArr: Dispatch<SetStateAction<IEventType[]>>
  assetArgs: IInputValues
  setAssetArgs: Dispatch<SetStateAction<IInputValues>>
  bodyReq: IReqBody
  setBodyReq: Dispatch<SetStateAction<IReqBody>>
  assetDependencyList: IEventType[]
  setAssetDependencyList: Dispatch<SetStateAction<IEventType[]>>
  key: string
  setKey: Dispatch<SetStateAction<string>>
  details: number | null
  setDetails: Dispatch<SetStateAction<number | null>>
}

export const initialStateArgs = {
  name: '',
  prize: '',
  model: '',
  id: '',
  date: '',
}

export const AppContext = createContext({} as IContextProps)

function Context({ children }: IProps) {
  const [assetType, setAssetType] = useState('event')
  const [assetTypeArr, setAssetTypeArr] = useState<IEventType[]>([])
  const [assetArgs, setAssetArgs] = useState(initialStateArgs)
  const [assetDependencyList, setAssetDependencyList] = useState<IEventType[]>([])
  const [key, setKey] = useState<string>('')
  const [details, setDetails] = useState<number | null>(null)

  const eventDate = assetArgs.date ? new Date(assetArgs.date).toISOString() : new Date().toISOString()
  const randomID = uuidv4()
    .replaceAll(/[A-Za-z]/g, '')
    .replace(/[-]/g, '')
  const eventBodyReq = {
    asset: [
      {
        '@assetType': 'event',
        '@key': nanoid(),
        name: assetArgs.name,
        date: eventDate,
        prize: assetArgs.prize,
        winner: { '@assetType': 'team', id: key },
      },
    ],
  }

  const teamBodyReq = {
    asset: [
      {
        '@assetType': 'team',
        id: randomID,
        name: assetArgs.name,
      },
    ],
  }

  const driverBodyReq = {
    asset: [
      {
        '@assetType': 'driver',
        id: randomID,
        name: assetArgs.name,
        team: {
          id: key,
        },
      },
    ],
  }

  const carBodyReq = {
    asset: [
      {
        '@assetType': 'car',
        id: randomID,
        model: assetArgs.model,
        driver: {
          id: key,
        },
      },
    ],
  }

  const [bodyReq, setBodyReq] = useState<IReqBody>(initialStateBodyReq)

  useEffect(() => {
    if (assetType === 'event') {
      setBodyReq(eventBodyReq)
    }
    if (assetType === 'team') {
      setBodyReq(teamBodyReq)
    }
    if (assetType === 'driver') {
      setBodyReq(driverBodyReq)
    }
    if (assetType === 'car') {
      setBodyReq(carBodyReq)
    }
  }, [assetArgs, key])

  return (
    <AppContext.Provider
      value={{
        assetType,
        setAssetType,
        assetTypeArr,
        setAssetTypeArr,
        assetArgs,
        setAssetArgs,
        bodyReq,
        setBodyReq,
        assetDependencyList,
        setAssetDependencyList,
        key,
        setKey,
        details,
        setDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
