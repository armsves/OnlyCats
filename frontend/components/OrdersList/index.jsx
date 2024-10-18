import React from 'react';
import "./index.css"
import { useAuth } from "../../auth"

const OrdersList = ({ orders, getOrders }) => {
  const { backendActor } = useAuth()

  const deleteOrder = async (orderId) => {
    let response = await backendActor.deleteOrder(Number(orderId));
    console.log("order deleted ", response);
    getOrders(); // Refresh the list
  };

  /*
  if (!contests) {
    return <div>Loading...</div>;
  }
  */

  return (
    <div className="OrdersList">
      <h2>Orders</h2>
      <div className="grid-header">
        <div style={{ textAlign: 'center' }} className="header-item">Order #</div>
        <div style={{ textAlign: 'center' }} className="header-item">Customer Principal</div>
        <div style={{ textAlign: 'center' }} className="header-item">Total</div>
        <div style={{ textAlign: 'center' }} className="header-item">Token</div>
        <div style={{ textAlign: 'center' }} className="header-item">BlockHeight</div>
        <div style={{ textAlign: 'center' }} className="header-item">Status</div>
        <div className="header-item"></div>
      </div>
      <div>
        {orders && orders.length > 0 ? (orders.sort((a, b) => Number(a.id) - Number(b.id)).map(order => (
          <div key={Number(order.id)}  className="grid-header">
            <div className="header-item" style={{ textAlign: 'center'}}>{Number(order.id)}</div>
            <div className="header-item" style={{ textAlign: 'center'}}>{`${order.customerId.slice(0, 5)}...${order.customerId.slice(-3)}`}</div>
            <div className="header-item" style={{ textAlign: 'center'}}>{Number(order.total)}</div>
            <div className="header-item" style={{ textAlign: 'center'}}>{order.symbol}</div>
            <div className="header-item" style={{ textAlign: 'center'}}>{order.paymentTx}</div>
            <div className="header-item" style={{ marginRight: '5px' }}>
              {(() => {
                //0 Payment Pending - 1 Payment Complete - 2 Order Processing - 3 Order Shipped - 4 order not processed
                switch (Number(order.status)) {
                  case 0: return "Payment Pending";
                  case 1: return "Payment Complete";
                  case 2: return "Order Processing";
                  case 3: return "Order Shipped";
                  case 4: return "Order not processed";
                }
              })()}
            </div>
            <div>{<button onClick={() => deleteOrder(order.id)} >Delete Order</button>}</div>
          </div>
        ))

        ) : (<p>No orders found.</p>)
        }
      </div>
    </div>
  );
};

export default OrdersList;
