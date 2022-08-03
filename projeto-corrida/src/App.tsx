import React from 'react'

import './sass/app.scss'

import Display from './components/Display/Display'
import Form from './components/Form/form'
import Context from './Store/Context'

function App() {
  return (
    <Context>
      <Form />
      <Display />
    </Context>
  )
}

export default App
