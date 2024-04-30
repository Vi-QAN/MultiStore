import { useState, useEffect } from 'react';
import { Accordion, Form, FormControl, Button, Container } from 'react-bootstrap';
import { SearchConsumer } from '../hooks/useSearch';

import { getCategories } from '../routes/categoryApi';
import { getProducts } from '../routes/productApi';

const Sidebar = () => {
    const { searchTerm, 
        chosenCategories, handleCategoryChange, setChosenCategories,
        priceRange, handlePriceRangeChange, 
        chosenSort, handleSortChange,
        setProducts, setTotalPage, setCurrentPage } = SearchConsumer();
    const [ categorySearchTerm, setCategorySearchTerm ] = useState('');
    const [ categories, setCategories ] = useState([])

    const handleSearch = async () => {
        const result = await getCategories(categorySearchTerm);
        setCategories(result);
    }

    const loadData = async () => {
        const result = await getCategories(categorySearchTerm);
        setCategories(result);
    }

    const handleApplyFilters = async () => {
        const result = await getProducts(searchTerm, chosenCategories, priceRange, chosenSort, 1, 12);
        setCurrentPage(1);
        setProducts(result.paginatedProducts.map(product => {return {...product, quantity: 1}}));
        setTotalPage(result.totalPage);
    }

    const handleClearFilters = () => {
        setChosenCategories([]);
        handlePriceRangeChange(0);
        handleSortChange('');
    }

    useEffect(() => {
        loadData();
    },[]);

    return categories.length > 0 && ( 
        <>
            <Accordion className="shadow mb-3 bg-body-tertiary rounded" defaultActiveKey="0" alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header >
                    Choose Categories
                    </Accordion.Header>
                    <Accordion.Body >
                        <Form>
                            <FormControl type="text" placeholder="Search category" className="mr-sm-2" onChange={(e) => setCategorySearchTerm(e.target.value)}/>
                            <Button className="mt-3 mb-3" variant="outline-success" onClick={() => handleSearch()}>Search</Button>
                            {categories.map((cat, index) => {
                                return (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        id={cat.id}
                                        label={cat.name}
                                        checked={chosenCategories.find(item => item === cat.id) !== undefined}
                                        onChange={() => handleCategoryChange(cat)}
                                    />
                                )
                            })}
                    
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header >
                        Choose Price Range
                    </Accordion.Header>
                    <Accordion.Body >

                        <Form>
                            <Form.Range
                            id="priceRange"
                            value={priceRange}
                            onChange={(e) => handlePriceRangeChange(e.target.value)}
                            min={1}
                            max={12000}
                            step={1}
                            />
                            <Form.Label>From: $0 To: ${priceRange}</Form.Label>
                        </Form>
                    </Accordion.Body>

                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header >
                        Sorted By
                    </Accordion.Header>
                    <Accordion.Body >
                        <Form.Group>
                            {['Cheapest', 'Most Expensive'].map((type, index) => {
                                return (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        id={index}
                                        label={type}
                                        checked={chosenSort=== type}
                                        onChange={() => handleSortChange(type)}
                                    />
                                )
                            })}
                        </Form.Group>
                        
                    </Accordion.Body>

                </Accordion.Item>
            </Accordion>
            <Container className="d-flex flex-row p-0 justify-content-between">
                <Button className="shadow rounded" variant="outline-success" onClick={() => handleApplyFilters()}>Apply Filters</Button>
                <Button className="shadow rounded" variant="outline-success" onClick={() => handleClearFilters()}>Clear Filters</Button>
            </Container>
        </>
  );
};

export default Sidebar;
