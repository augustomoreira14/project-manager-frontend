/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import { Table, Row, Col, Button, Breadcrumb } from 'react-bootstrap'
import configData from '../config.json'
import axios from 'axios'

export default class Project extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      items: []
    }

    this.populateItems = this.populateItems.bind(this)
  }
  
  componentDidMount () {
    this.reloadItems()
  }
  
  reloadItems () {
    axios.get(configData.SERVER_URL + 'principal/projetos')
      .then((res) => {
        this.setState({
          items: res.data
        });
      }) 
  }

  populateItems () {
    axios.get(configData.SERVER_URL + 'principal/povoar')
      .then((res) => {
        this.reloadItems()
      }) 
  }

  accessActivities (id) {
    const { history } = this.props
    
    history.push(`projects/${id}`)
  }

  render () {
    const { items } = this.state

    return (
        <>
          <Row>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item active>
                  Projetos
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col><h2>Projetos</h2></Col>
            <Col>
              <Button onClick={this.populateItems} className="float-right" variant="primary">
                <i className="fa fa-fire"></i> Popular
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
              <tbody>
                {items.length <= 0 && <tr>
                  <td colSpan="3">Nenhum conteúdo para mostrar</td>
                </tr>}

                {items.map(item => (
                  <tr key={ item.id }>
                    <td>{ item.id }</td>
                    <td>{ item.descricao }</td>
                    <td>
                      <Button onClick={() => this.accessActivities(item.id)}><i className="fa fa-search"></i></Button>
                    </td>
                  </tr>
                ))}
   
                  </tbody>
              </Table>          
            </Col>
          </Row>
        </>
    )
  }
} 

