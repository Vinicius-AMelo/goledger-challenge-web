import React from 'react'

import './sass/app.scss'

import Display from './components/Display/Display'
import Form from './components/Form/form'
import Home from './components/Home/home'
import Context from './Store/Context'

function App() {
  return (
    <Context>
      <Home />
      <Form />
      <Display />
    </Context>
  )
}

export default App
