import React, { Component } from 'react';
import AppNav from './AppNav';
import {Container, Form, FormGroup, Button, Table} from 'reactstrap';
import {Link} from 'react-router-dom';

class Category extends Component {
    state = { 
        isLoading : true,
        Categories : [],
        category:{
            name:''
        }
     }

     constructor(props){
        super(props)
        this.state = {
            isLoading : true,
            Categories : [],
            category:{
                name:''
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleSubmit(event){
        event.preventDefault();
        const {category} = this.state;
        await fetch('/categories/addCategory', {
            method: 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(category)
        }).then(()=>window.location.reload(true));
        this.props.history.push("/categories")
    }

    handleChange(event){
        const target= event.target;
        const value=target.value;
        const name=target.name;
        let category={...this.state.category};
        category[name] = value;
        this.setState({category});
    }

     async componentDidMount(){
         const response=await fetch('/categories/getAllCategories')
         const body = await response.json();
         this.setState({Categories :body , isLoading: false});
     }

     async remove(id){
        await fetch(`/categories/removeCategory/${id}`,
        {
            method: 'DELETE',
            headers : {
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }).then(() => {
            let updatedCategories = [...this.state.Categories].filter(i => i.id !== id);
            this.setState({Categories : updatedCategories});
            window.location.reload(true);
        });
    }

    render() { 
        const {Categories , isLoading} = this.state;
        const title = <h3>Add Categories</h3>
        if(isLoading)
            return(<div>Loading...</div>);

        
        let rows = 
        Categories.map( category =>
            <tr key={category.id}>
                <td>{category.name}</td>
                <td><Button size="sm" color="danger" onClick={ () => this.remove(category.id)}>Delete</Button></td>
            </tr>
            )

        return ( 
            <div>
                <AppNav/>
                <h2>Categories</h2>
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <label for="name">Name</label>
                            <input type="text" name="name" id="title" 
                            onChange={this.handleChange} autoComplete="name"/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/categories">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
                <Container>
                <h3>Category List</h3>
                <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="40%">Name</th>
                        <th width="60%">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>

                </Table>
            </Container>
                
            </div>
         );
    }
}
 
export default Category;