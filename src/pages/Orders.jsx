import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Table, Pagination } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";

import { GrView } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";

import Navbar from '../components/Navbar';
import OrderSummaryModal from '../components/OrderSummaryModal';

import { getOrders, getOrder, updateOrder } from '../routes/orderApi';

import { AuthenticationConsumer } from '../hooks/useAuthentication';

const OrderPage = () => {
    const { isAuthenticated, token } = AuthenticationConsumer();
    const [ orders, setOrders ] = useState([]);
    const onFiltering = useRef(false);
    const [ filters, setFilters ] = useState({date: null, totalPrice: 1});
    const [ viewedOrder, setViewedOrder ] = useState(null);
    const [ show, setShow] = useState(false);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPage, setTotalPage ] = useState(1); 

    const navigate = useNavigate();

    const handleClose = () => setShow(false);

    const viewOrder = async (order) => {
        console.log(order)
        setViewedOrder(order);
        setShow(true);
    }

    const cancelOrder = async (order, index) => {
        const result = await updateOrder(order._id, "Cancelled", token);
        console.log(result);
        if (result !== 'error'){
            const newOrders = [...orders];
            newOrders[index].status = result.status;
            newOrders[index].cancelledAt = result.cancelledAt;
            setOrders(newOrders);
        }
    }

    const handlePageChange = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const result = await getOrders(filters, pageNumber, 12, token);
        setOrders(result.paginatedOrders);
        setTotalPage(result.totalPage);
      }

    const loadData = async () => {
        if (onFiltering.current) return;
        const result = await getOrders(filters, 1, 12, token);
        if (result === 'error') {
            navigate('/home');
        }
        setOrders(result.paginatedOrders);
        setTotalPage(result.totalPage);
    }

    const handleFilterChange = (newFilters) => {
        if (!newFilters.date && !newFilters.totalPrice) return;
        if (newFilters.totalPrice) {
            if (newFilters.totalPrice >= 1){
                setFilters(f => {return {...f, totalPrice: newFilters.totalPrice}});
            }
        };

        if (newFilters.date){
            setFilters(f => {return {...f, date: newFilters.date}});
        }
    }

    const handleApplyFilters = async () => {
        onFiltering.current = true;
        const result = await getOrders(filters, 1, 12, token);
        setOrders(result.paginatedOrders);
        setTotalPage(result.totalPage);
    }

    const handleResetFilters = async () => {
        onFiltering.current = false;
        setFilters({date: null, totalPrice: 1});
        const result = await getOrders({date: null, totalPrice: 1}, 1, 12, token);
        setOrders(result.paginatedOrders);
        setTotalPage(result.totalPage);
    }

    const convertTo12HourFormat = (datetimeString) => {
        const date = new Date(datetimeString);
        return date.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/home');
        loadData();
        const interval = setInterval(loadData, 30000);
        return () => {
            clearInterval(interval);
        }
    },[])
    return (
        <div className="container-fluid">
            <Navbar />
            <h1>Orders</h1>
            <div class="container mt-4 mb-3">
                    <div class="row">
                        <div className="d-flex flex-column flex-md-row col-md-5">
                            From Date <input type="date" class="form-control mb-2" onChange={(e) => handleFilterChange({date: e.target.value})} placeholder="After date..." />
                        </div>
                        <div className="d-flex flex-column flex-md-row col-md-5">
                            From Price <input type="number" value={filters.totalPrice} class="form-control mb-2" placeholder="Total price..." onChange={(e) => handleFilterChange({totalPrice: e.target.value})}/>
                        </div>
                        <div className="col-md-2 text-right">
                            <button className="btn btn-primary me-3" onClick={() => handleApplyFilters()}>Filter</button>
                            <button className="btn btn-primary" onClick={() => handleResetFilters()}>Reset</button>
                        </div>
                    </div>
            </div>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                <Container fluid className="p-0">
                
                <Table striped bordered hover className='shadow rounded'>
                    <thead>
                        <tr>
                        <th>Order No</th>
                        <th>Number of Products</th>
                        <th>Date Added</th>
                        <th>Status</th>
                        {/* <th>Total</th> */}
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            let statusColor;
                            if (order.status === 'Pending') {
                                statusColor = "text-secondary"
                            } else if (order.status === 'Cancelled') {
                                statusColor = "text-danger"
                            } else {
                                statusColor = "text-primary"
                            }
                            return (
                            <tr key={index}>
                                <td>#{order.orderNumber}</td>
                                <td>{order.products.length}</td>
                                <td>{convertTo12HourFormat(order.createdAt)}</td>
                                <td ><span className={statusColor}>{order.status}</span></td>
                                {/* <td>${order.total.toFixed(2)}</td> */}
                                <td>
                                <Button className="bg-transparent border-0" onClick={() => viewOrder(order)}>
                                    <GrView color={'black'} />
                                </Button>{' '}
                                {order.status === 'Pending' && <Button className="bg-transparent border-0" onClick={() => cancelOrder(order, index)}>
                                    <IoMdClose color={'black'} size={20}/>
                                </Button>}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </Table>
                <Pagination className='justify-content-end '>
                    {currentPage - 1 > 0 && <Pagination.First className="shadow" onClick={() => handlePageChange(1)}/>}
                    {currentPage - 1 > 0 && <Pagination.Prev className="shadow" onClick={() => handlePageChange(currentPage - 1)}/>}
                    {totalPage > 1 && <Pagination.Item className="shadow" active>{currentPage}</Pagination.Item>}
                    {currentPage + 1 <= totalPage && <Pagination.Next className="shadow" onClick={() => handlePageChange(currentPage + 1)}/>}
                    {currentPage + 1 <= totalPage && <Pagination.Last className="shadow" onClick={() => handlePageChange(totalPage)}/>}
                </Pagination>
                </Container>
            )}
            {viewedOrder && <OrderSummaryModal order={viewedOrder} show={show} onHide={handleClose}/>}
        </div>
  );
};

export default OrderPage;
