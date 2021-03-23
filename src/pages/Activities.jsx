import React from 'react'
import { Table, Row, Col, Button, Breadcrumb, FormControl, Form, Modal } from 'react-bootstrap'
import configData from '../config.json'
import axios from 'axios'

export default class Activities extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      items: [],
      isLoaded: false,
      error: null,
      search: '',
      show: false,
      titleModal: '',
      newItem: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCloseModalCreate = this.handleCloseModalCreate.bind(this)
    this.newItem = this.newItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.showModal = this.showModal.bind(this)
    this.saveItem = this.saveItem.bind(this)
  }

  handleChange(event) {
    this.setState({search: event.target.value});
  }

  handleSubmit(event) {
    this.filterItemById(this.state.search)
    event.preventDefault();
  }

  componentDidMount () {
    this.reloadItems()
  }

  reloadItems () {
    const { id } = this.props.match.params

    axios.get(configData.SERVER_URL + 'projeto/' + id)
      .then((res) => {
        this.setState({
          isLoaded: true,
          items: res.data
        });
      }) 
  }
  
  filterItemById (id) {
    if (id) {
      axios.get(configData.SERVER_URL + 'atividade/' + id)
        .then((res) => {
            this.setState({
              items: res.data
            });
          }
        )      
    } else {
      this.reloadItems()
    }
  }

  removeItem (id) {
    axios.delete(configData.SERVER_URL + 'atividade/' + id)
      .then(res => {
        this.reloadItems()
      })   
  }
  
  handleCloseModalCreate () {
    this.setState({
      show: false
    })
  }

  saveItem () {
    var formData = new FormData()
    const { newItem } = this.state
    
    for (let i in newItem) {
      formData.append(i, newItem[i])
    }
    
    if (newItem.id) {
      axios.put(configData.SERVER_URL + 'atividade/' + newItem.id, formData)
        .then(res => {
          this.reloadItems()
          this.handleCloseModalCreate()
        })
    } else {
      formData.append('projeto_id', this.props.match.params.id)

      axios.post(configData.SERVER_URL + 'atividade', formData)
        .then(res => {
          this.reloadItems()
          this.handleCloseModalCreate()
          this.setState({
            newItem: {}
          })
        })     
    }
  }

  showModal (title) {
    this.setState({
      show: true,
      titleModal: title
    })
  }

  newItem () {
    this.setState({
      newItem: {}
    })

    this.showModal('Nova Atividade')
  }

  editItem (item) {
    this.setState({
      newItem: { ...item }
    })

    this.showModal('Editar Atividade')
  }

  render () {
    const {items} = this.state
    return (
      <>
        <Row>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => this.props.history.push('/')}>
                Projetos
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Atividades</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col><h2>Atividades</h2></Col>
        </Row>
        <Row>
            <Col>
              <Form onSubmit={this.handleSubmit} inline>
                <FormControl value={this.state.value} onChange={this.handleChange} type="text" placeholder="Buscar por id" className="mr-sm-2" />
                <Button type="submit" variant="primary">Buscar</Button>
              </Form>
            </Col>
            <Col>
              <Button onClick={this.newItem} className="float-right" variant="primary">+ Nova Atividade</Button>
            </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Data de Cadastro</th>
                  <th>Projeto</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length <= 0 && <tr>
                  <td colSpan="5">Nenhum conteúdo para mostrar</td>
                </tr>}
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.descricao}</td>
                    <td>{new Date(item.data).toLocaleString()}</td>
                    <td>{item.projeto}</td>
                    <td>
                      <Button onClick={ () => this.editItem(item) } variant="warning"><i className="fa fa-edit"></i></Button>{ ' ' }
                      <Button onClick={ () => this.removeItem(item.id) } variant="danger"><i className="fa fa-trash"></i></Button>
                    </td>
                  </tr>   
                ))}

              </tbody>
            </Table>
          </Col>
        </Row>
        <Modal show={this.state.show} onHide={this.handleCloseModalCreate}>
          <Modal.Header closeButton>
            <Modal.Title>{ this.state.titleModal }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={ (event) => event.preventDefault() }>
              <FormControl value={this.state.newItem.descricao} onChange={(event) => this.setState(state => ({ newItem: { ...state.newItem, descricao: event.target.value } } ) )} type="text" placeholder="Descrição da Atividade" />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModalCreate}>
              Fechar
            </Button>
            <Button onClick={ this.saveItem } variant="primary">
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
