import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="https://api.airtable.com/v0/appOg91JwIs4SjRSR/Phonebook?api_key=keyE2G3crULpLFifV";

class App extends Component {
  state={
    data:[],
    modalInsert: false,
    modalDelete: false,
    form:{
      id: '',
      name: '',
      email: '',
      telephone: '',
      address: ''
    }
  }

  getRequest=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data.records});
      //console.log(response.data.records);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  postRequest=async()=>{
    delete this.state.form.id;
    let records ={
      fields:{
        name: this.state.form.name,
        email: this.state.form.email,
        telephone: this.state.form.telephone,
        address: this.state.form.address
      }
    }
    //console.log(records);
    await axios.post(url,records).then(response=>{
      this.modalInsert();
      this.getRequest();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  patchRequest=()=>{
    let records ={
      records: [
        {
          id: this.state.form.id,
          fields:{
            name: this.state.form.name,
            email: this.state.form.email,
            telephone: this.state.form.telephone,
            address: this.state.form.address
          }
        } 
      ]
    }
    console.log(records);
    axios.patch(url, records).then(response=>{
      this.modalInsert();
      this.getRequest();
    })
  }

  deleteRequest=()=>{
    axios.delete('https://api.airtable.com/v0/appOg91JwIs4SjRSR/Phonebook/'+this.state.form.id+'?api_key=keyE2G3crULpLFifV').then(response=>{
      this.setState({modalDelete: false});
      this.getRequest();
    })
  }

  modalInsert=()=>{
    this.setState({modalInsert: !this.state.modalInsert});
  }

  selectItem=(item)=>{
    this.setState({
      modalType: 'update',
      form: {
        id: item.id,
        name: item.fields.name,
        email: item.fields.email,
        telephone: item.fields.telephone,
        address: item.fields.address
      }
    })
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    //console.log(this.state.form);
  }

  componentDidMount() {
    this.getRequest();
  }
    

  render(){
    const {form}=this.state;
    return (
      <div className="App">
        <img src={logo} alt="Logo" className="logo" />
        <div className="header-container">
          <h1>Phonebook</h1>
          <button className="btn add-new" onClick={()=>{this.setState({form: null, modalType: 'insert'}); this.modalInsert()}}>Add new</button>
        </div>
        <div className="table-container">
          <table className="table ">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(item=>{
                return(
                  <tr key={item.id}>
                    <td>{item.fields.name}</td>
                    <td>{item.fields.email}</td>
                    <td>{item.fields.telephone}</td>
                    <td>{item.fields.address}</td>
                    <td>
                    <button className="btn btn-primary" onClick={()=>{this.selectItem(item); this.modalInsert()}}><FontAwesomeIcon icon={faEdit}/></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={()=>{this.selectItem(item); this.setState({modalDelete: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>


        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader tag={'div'}  style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={()=>this.modalInsert()}>x</span>
            <h3>{form?'Edit record': 'Add new record'}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">

            <br />
            <label htmlFor="nombre">Name</label>
            <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form?form.name: ''}/>
            <br />
            <label htmlFor="email">Email</label>
            <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form?form.email: ''}/>
            <br />
            <label htmlFor="telephone">Phone</label>
            <input className="form-control" type="text" name="telephone" id="telephone" onChange={this.handleChange} value={form?form.telephone: ''}/>
            <br />
            <label htmlFor="address">Address</label>
            <input className="form-control" type="text" name="address" id="address" onChange={this.handleChange} value={form?form.address: ''}/>                  
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.modalType=='insert'?
            <button className="btn btn-success" onClick={()=>this.postRequest()}>
              Add
            </button>: <button className="btn btn-primary" onClick={()=>this.patchRequest()}>
              Update
            </button>
            }
            <button className="btn btn-danger" onClick={()=>this.modalInsert()}>Cancel</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalDelete}>
          <ModalBody>
            Are you sure you want to delete {form && form.name}'s contact?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.deleteRequest()}>Yes</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalDelete: false})}>No</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}
export default App;
