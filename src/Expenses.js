import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import {Container, Input, Label, Form, FormGroup, Button, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

class Expenses extends Component {

    emptyItem = {

        date:new Date(),
        description:'Dinner',
        category:{
            id:1,
            name:'Groceries'
        }
    }

    constructor(props){
        super(props)
        this.state = {
            date: new Date(),
            isLoading : true,
            expenses : [],
            categories : [],
            item: this.emptyItem
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }


    async handleSubmit(event){
        event.preventDefault();
        const {item} = this.state;
        await fetch('/expenses/addExpense', {
            method: 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(item)
        }).then(()=>window.location.reload(true));
        this.props.history.push("/expenses")
    }

    handleChange(event){
        const target= event.target;
        const value=target.value;
        const name=target.name;
        let item={...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleDateChange(date){
        let item ={...this.state.item};
        item.date = date;
        this.setState({item});
    }

    handleCategoryChange(event){
        const target= event.target;
        const value = target.value;
        const name=target.name;
        let item={...this.state.item};
        var category = this.state.categories.find(categ => categ.name === value);
        item.category = category;
        this.setState({item});
    }
    

    async remove(id){
        await fetch(`/expenses/removeExpense/${id}`,
        {
            method: 'DELETE',
            headers : {
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }).then(() => {
            let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
            this.setState({expenses : updatedExpenses});
        });
    }

    async componentDidMount(){
         const response= await fetch('/categories/getAllCategories');
         const body= await response.json();
         this.setState({categories : body, isLoading:false});

         const responseExp = await fetch('/expenses/getAllExpenses');
         const bodyExp = await responseExp.json();
         this.setState({expenses:bodyExp, isLoading:false});
     }



    render() { 
        const title= <h3>Add Expense</h3>
        const {categories, isLoading} = this.state;
        const {expenses} = this.state;

        if (isLoading)
            return(<div>Loading...</div>)

        let optionList = 
            categories.map( category =>
                <option id={category.id} key={category.id}>
                    {category.name}
                </option>)
        
        let rows = 
            expenses.map( expense =>
                <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td><Moment date={expense.date} format="MM/DD/YYYY"></Moment></td>
                    <td>{expense.category.name}</td>
                    <td>{expense.amount}</td>
                    <td><Button size="sm" color="danger" onClick={ () => this.remove(expense.id)}>Delete</Button></td>
                </tr>
                )

        return ( 
            <div>
                <AppNav/>
            <h2>Expenses</h2> 
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <label for="description">Description</label>
                        <input type="text" name="description" id="title" 
                        onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>

                    <FormGroup>
                        <label for="category">Category</label>
                        <select onChange={this.handleCategoryChange}>
                            {optionList}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <label for="amount">Amount</label>
                        <input type="text" name="amount" id="title"
                        onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>

                    <FormGroup>
                        <label for="expenseDate">Expense Date</label>
                        <DatePicker selected={this.state.item.date} onChange={this.handleDateChange}/>
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/categories">Cancel</Button>
                    </FormGroup>


                </Form>
            </Container>

            <Container>
                <h3>Expense List</h3>
                <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="35%">Description</th>
                        <th width="10%">Date</th>
                        <th> Category</th>
                        <th width="10%">Amount</th>
                        <th width="10%">Action</th>
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
 
export default Expenses;<h2>Expenses</h2>